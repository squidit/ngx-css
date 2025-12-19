import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
  forwardRef,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  inject,
  TrackByFunction,
} from '@angular/core';
import { NgClass, NgStyle, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
} from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Option } from '../../interfaces/option.interface';
import { SqTooltipComponent } from '../sq-tooltip/sq-tooltip.component';
import { SqLoaderComponent } from '../sq-loader/sq-loader.component';
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';
import { SqClickOutsideDirective } from '../../directives/sq-click-outside/sq-click-outside.directive';
import { SqDataTestDirective } from '../../directives/sq-data-test/sq-data-test.directive';
import { useMemo } from '../../helpers/memo.helper';

/**
 * Modo de busca do select.
 * - `'local'`: Filtra as opções client-side
 * - `'remote'`: Emite evento `searchChange` para busca no backend
 */
export type SelectSearchMode = 'local' | 'remote';

/**
 * Interface para grupos de opções.
 */
export interface OptionGroup {
  /**
   * Label do grupo.
   */
  label: string;
  /**
   * Opções do grupo.
   */
  options: Option[];
}

/**
 * Componente de select baseado em Reactive Forms.
 * Suporta busca local, busca remota e infinity scroll.
 *
 * @example
 * ```html
 * <!-- Select simples -->
 * <sq-select-form-control
 *   [formControl]="cityControl"
 *   [label]="'Cidade'"
 *   [options]="cities"
 * ></sq-select-form-control>
 *
 * <!-- Com busca local -->
 * <sq-select-form-control
 *   [formControl]="cityControl"
 *   [label]="'Cidade'"
 *   [options]="cities"
 *   [searchable]="'local'"
 * ></sq-select-form-control>
 *
 * <!-- Com busca remota e infinity scroll -->
 * <sq-select-form-control
 *   [formControl]="productControl"
 *   [label]="'Produto'"
 *   [options]="products"
 *   [searchable]="'remote'"
 *   [infiniteScroll]="true"
 *   [hasMore]="hasMoreProducts"
 *   [loading]="loadingProducts"
 *   (searchChange)="searchProducts($event)"
 *   (loadMore)="loadMoreProducts()"
 * ></sq-select-form-control>
 * ```
 */
@Component({
  selector: 'sq-select-form-control',
  templateUrl: './sq-select-form-control.component.html',
  styleUrls: ['./sq-select-form-control.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    NgTemplateOutlet,
    AsyncPipe,
    ReactiveFormsModule,
    ScrollingModule,
    SqTooltipComponent,
    SqLoaderComponent,
    UniversalSafePipe,
    SqClickOutsideDirective,
    SqDataTestDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SqSelectFormControlComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SqSelectFormControlComponent),
      multi: true,
    },
  ],
})
export class SqSelectFormControlComponent implements ControlValueAccessor, Validator, OnDestroy {
  // ============================================================
  // Identificação
  // ============================================================

  /**
   * Nome do input.
   */
  @Input() name = `select-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  /**
   * ID do input.
   */
  @Input() id?: string;

  /**
   * Label do campo.
   */
  @Input() label = '';

  /**
   * Classe CSS customizada.
   */
  @Input() customClass = '';

  /**
   * Placeholder quando nenhum valor está selecionado.
   */
  @Input() placeholder = '';

  // ============================================================
  // Opções
  // ============================================================

  /**
   * Lista de opções disponíveis.
   */
  @Input() options: Option[] = [];

  /**
   * Opções agrupadas (como optgroup do HTML).
   */
  @Input() optionsWithGroups: OptionGroup[] = [];

  // ============================================================
  // Busca
  // ============================================================

  /**
   * Modo de busca.
   * - `'local'`: Filtra opções client-side
   * - `'remote'`: Emite `searchChange` para busca no backend
   * - `undefined`: Sem busca
   */
  @Input() searchable?: SelectSearchMode;

  /**
   * Debounce da busca em milissegundos.
   */
  @Input() searchDebounce = 300;

  /**
   * Mínimo de caracteres para iniciar a busca.
   */
  @Input() minSearchLength = 0;

  /**
   * Placeholder do campo de busca.
   */
  @Input() searchPlaceholder = 'Buscar...';

  // ============================================================
  // Infinity Scroll
  // ============================================================

  /**
   * Habilita infinity scroll.
   */
  @Input() infiniteScroll = false;

  /**
   * Indica se há mais itens para carregar.
   */
  @Input() hasMore = false;

  // ============================================================
  // Estado
  // ============================================================

  /**
   * Se o campo está em loading.
   */
  @Input() loading = false;

  /**
   * Se o campo é somente leitura.
   */
  @Input() readonly = false;

  // ============================================================
  // Aparência
  // ============================================================

  /**
   * Cor de fundo do select.
   */
  @Input() backgroundColor = '';

  /**
   * Cor da borda do select.
   */
  @Input() borderColor = '';

  /**
   * Cor de fundo do hover nas opções.
   */
  @Input() hoverColor = '';

  /**
   * Cor da label.
   */
  @Input() labelColor = '';

  /**
   * Mensagem do tooltip.
   */
  @Input() tooltipMessage = '';

  /**
   * Posição do tooltip.
   */
  @Input() tooltipPlacement: 'center top' | 'center bottom' | 'left center' | 'right center' = 'right center';

  /**
   * Cor do tooltip.
   */
  @Input() tooltipColor = 'inherit';

  /**
   * Ícone do tooltip.
   */
  @Input() tooltipIcon = '';

  // ============================================================
  // Data Test
  // ============================================================

  /**
   * Data-test para o container do select.
   */
  @Input() selectDataTest = 'select-form-control';

  /**
   * Data-test para o input de busca.
   */
  @Input() searchInputDataTest = 'select-search-input';

  /**
   * Data-test para as opções.
   */
  @Input() optionDataTest = 'select-option';

  /**
   * Função customizada para trackBy no virtual scroll.
   * Se não fornecida, usa o fakeId gerado automaticamente.
   */
  @Input() trackByFn?: (index: number, option: Option) => unknown;

  // ============================================================
  // Outputs
  // ============================================================

  /**
   * Evento de busca (modo remote).
   */
  @Output() searchChange = new EventEmitter<string>();

  /**
   * Evento para carregar mais itens (infinity scroll).
   */
  @Output() loadMore = new EventEmitter<void>();

  /**
   * Evento de foco.
   */
  @Output() focused = new EventEmitter<FocusEvent>();

  /**
   * Evento de blur.
   */
  @Output() blurred = new EventEmitter<FocusEvent>();

  // ============================================================
  // Templates
  // ============================================================

  /**
   * Template customizado para label.
   */
  @ContentChild('labelTemplate')
  labelTemplate: TemplateRef<HTMLElement> | null = null;

  /**
   * Template customizado para cada opção.
   * Contexto: { $implicit: Option, option: Option, index: number }
   */
  @ContentChild('optionTemplate')
  optionTemplate: TemplateRef<{ $implicit: Option; option: Option; index: number }> | null = null;

  /**
   * Template customizado para o valor selecionado.
   * Contexto: { $implicit: Option, option: Option }
   */
  @ContentChild('selectedTemplate')
  selectedTemplate: TemplateRef<{ $implicit: Option; option: Option }> | null = null;

  /**
   * Template para quando não há opções.
   */
  @ContentChild('emptyTemplate')
  emptyTemplate: TemplateRef<HTMLElement> | null = null;

  // ============================================================
  // Estado interno
  // ============================================================

  /**
   * FormControl interno.
   */
  control = new FormControl<Option | null>(null);

  /**
   * Subject para o texto de busca.
   */
  searchSubject = new Subject<string>();

  /**
   * Texto atual da busca.
   */
  searchText = '';

  /**
   * Se o dropdown está aberto.
   */
  isOpen = false;

  /**
   * Se o dropdown deve ser renderizado.
   */
  renderDropdown = false;

  /**
   * Opções filtradas (para busca local).
   */
  filteredOptions: Option[] = [];

  /**
   * Subject para cleanup.
   */
  private destroy$ = new Subject<void>();

  /**
   * Mapa de fakeIds para opções (usado no trackBy quando não há trackByFn customizado).
   */
  private optionFakeIdMap = new WeakMap<Option, string>();

  /**
   * Contador para gerar fakeIds únicos.
   */
  private fakeIdCounter = 0;

  /**
   * Callback do ControlValueAccessor.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: Option | null) => void = () => {};

  /**
   * Callback do ControlValueAccessor.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  /**
   * Callback do Validator.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onValidationChange: () => void = () => {};

  /**
   * ChangeDetectorRef injetado.
   */
  private cdr = inject(ChangeDetectorRef);

  /**
   * ElementRef injetado.
   */
  private elementRef = inject(ElementRef);

  /**
   * Construtor.
   */
  constructor() {
    // Subscription para controle interno
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.onChange(value);
    });

    // Subscription para busca com debounce
    this.searchSubject
      .pipe(debounceTime(this.searchDebounce), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(term => {
        if (this.searchable === 'remote') {
          this.searchChange.emit(term);
        }
        this.cdr.markForCheck();
      });
  }

  /**
   * Cleanup.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================================
  // ControlValueAccessor
  // ============================================================

  /**
   * Escreve o valor.
   */
  writeValue(value: Option | null): void {
    this.control.setValue(value, { emitEvent: false });
    this.cdr.markForCheck();
  }

  /**
   * Registra callback onChange.
   */
  registerOnChange(fn: (value: Option | null) => void): void {
    this.onChange = fn;
  }

  /**
   * Registra callback onTouched.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Define estado disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
    this.cdr.markForCheck();
  }

  // ============================================================
  // Validator
  // ============================================================

  /**
   * Valida o controle.
   */
  validate(): ValidationErrors | null {
    return this.control.errors;
  }

  /**
   * Registra callback de validação.
   */
  registerOnValidatorChange(fn: () => void): void {
    this.onValidationChange = fn;
  }

  // ============================================================
  // Getters
  // ============================================================

  /**
   * Valor atual selecionado.
   */
  get value(): Option | null {
    return this.control.value;
  }

  /**
   * Se está desabilitado.
   */
  get disabled(): boolean {
    return this.control.disabled;
  }

  /**
   * Opções a serem exibidas (considerando busca local).
   */
  get displayOptions(): Option[] {
    if (this.searchable === 'local' && this.searchText) {
      return this.filterOptionsLocally(this.searchText);
    }
    return this.options;
  }

  /**
   * Todas as opções (incluindo grupos).
   */
  get allOptions(): Option[] {
    const groupedOptions = this.optionsWithGroups.flatMap(g => g.options);
    return [...groupedOptions, ...this.options];
  }

  // ============================================================
  // Métodos públicos
  // ============================================================

  /**
   * TrackBy para ngFor.
   */
  trackByOption: TrackByFunction<Option> = useMemo((_index, option) => option.value);

  /**
   * Abre/fecha o dropdown.
   */
  async toggleDropdown(): Promise<void> {
    if (this.disabled || this.readonly || this.loading) {
      return;
    }

    if (this.isOpen) {
      this.closeDropdown();
    } else {
      await this.openDropdown();
    }
  }

  /**
   * Abre o dropdown.
   */
  async openDropdown(): Promise<void> {
    this.renderDropdown = true;
    this.filteredOptions = this.options;
    this.cdr.detectChanges();

    // Se modo remote e lista vazia, emite busca inicial
    if (this.searchable === 'remote' && this.options.length === 0) {
      this.searchChange.emit(this.searchText);
    }

    // Pequeno delay para animação
    await new Promise(resolve => setTimeout(resolve, 50));
    this.isOpen = true;
    this.cdr.detectChanges();
  }

  /**
   * Fecha o dropdown.
   */
  closeDropdown(): void {
    this.isOpen = false;
    this.searchText = '';
    this.cdr.detectChanges();

    // Delay para animação de fechamento
    setTimeout(() => {
      this.renderDropdown = false;
      this.cdr.detectChanges();
    }, 200);
  }

  /**
   * Seleciona uma opção.
   */
  selectOption(option: Option): void {
    if (option.disabled) {
      return;
    }

    this.control.setValue(option);
    this.closeDropdown();
    this.onTouched();
  }

  /**
   * Handler de busca.
   */
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const term = input.value;
    this.searchText = term;

    if (term.length >= this.minSearchLength || term.length === 0) {
      if (this.searchable === 'local') {
        this.filteredOptions = this.filterOptionsLocally(term);
        this.cdr.detectChanges();
      } else if (this.searchable === 'remote') {
        this.searchSubject.next(term);
      }
    }
  }

  /**
   * Handler de scroll (infinity scroll) - para lista simples.
   */
  onScroll(event: Event): void {
    if (!this.infiniteScroll || !this.hasMore || this.loading) {
      return;
    }

    const element = event.target as HTMLElement;
    const scrollBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    if (scrollBottom < 100) {
      this.loadMore.emit();
    }
  }

  /**
   * Handler de scroll virtual (cdk-virtual-scroll-viewport).
   */
  onVirtualScroll(): void {
    if (!this.infiniteScroll || !this.hasMore || this.loading) {
      return;
    }

    // Verifica se chegou perto do fim da lista
    const viewport = this.elementRef.nativeElement.querySelector('cdk-virtual-scroll-viewport');
    if (viewport) {
      const scrollBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      if (scrollBottom < 100) {
        this.loadMore.emit();
      }
    }
  }

  /**
   * TrackBy function para virtual scroll.
   * Usa trackByFn customizado se fornecido, senão usa fakeId.
   */
  trackByValue = (index: number, option: Option): unknown => {
    // Se há função customizada, usa ela
    if (this.trackByFn) {
      return this.trackByFn(index, option);
    }

    // Senão, usa o fakeId gerado
    return this.getOptionFakeId(option);
  };

  /**
   * Obtém ou gera um fakeId para a opção.
   */
  private getOptionFakeId(option: Option): string {
    let fakeId = this.optionFakeIdMap.get(option);
    if (!fakeId) {
      fakeId = `option-${++this.fakeIdCounter}`;
      this.optionFakeIdMap.set(option, fakeId);
    }
    return fakeId;
  }

  /**
   * Handler de blur.
   */
  onBlur(event: FocusEvent): void {
    // Verifica se o foco foi para dentro do dropdown
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (relatedTarget && this.elementRef.nativeElement.contains(relatedTarget)) {
      return;
    }

    this.onTouched();
    this.blurred.emit(event);
  }

  /**
   * Handler de focus.
   */
  onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  // ============================================================
  // Métodos privados
  // ============================================================

  /**
   * Filtra opções localmente.
   */
  private filterOptionsLocally(term: string): Option[] {
    if (!term) {
      return this.options;
    }

    const lowerTerm = term.toLowerCase();
    return this.options.filter(option => option.label.toLowerCase().includes(lowerTerm));
  }
}
