import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { OptionMulti } from '../../interfaces/option.interface';
import { SqLoaderComponent } from '../sq-loader/sq-loader.component';
import { SqTooltipComponent } from '../sq-tooltip/sq-tooltip.component';
import { SqSelectorComponent } from '../sq-selector/sq-selector.component';
import { SqClickOutsideDirective } from '../../directives/sq-click-outside/sq-click-outside.directive';
import { SqDataTestDirective } from '../../directives/sq-data-test/sq-data-test.directive';
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';
import { SqFormControlBaseDirective } from '../../directives/sq-form-control-base';

/**
 * Componente de select múltiplo com Reactive Forms.
 * Unifica sq-select-multi e sq-select-multi-tags em um único componente.
 *
 * @example
 * // Modo default (compacto)
 * <sq-select-multi-form-control
 *   [label]="'Cidades'"
 *   [options]="cities"
 *   [formControl]="citiesControl"
 * ></sq-select-multi-form-control>
 *
 * @example
 * // Modo tags (tags removíveis)
 * <sq-select-multi-form-control
 *   [label]="'Tags'"
 *   [options]="tags"
 *   [formControl]="tagsControl"
 *   [displayMode]="'tags'"
 * ></sq-select-multi-form-control>
 */
@Component({
  selector: 'sq-select-multi-form-control',
  templateUrl: './sq-select-multi-form-control.component.html',
  styleUrls: ['./sq-select-multi-form-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    NgTemplateOutlet,
    ReactiveFormsModule,
    ScrollingModule,
    SqLoaderComponent,
    SqTooltipComponent,
    SqSelectorComponent,
    SqClickOutsideDirective,
    SqDataTestDirective,
    UniversalSafePipe,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SqSelectMultiFormControlComponent,
      multi: true,
    },
  ],
})
export class SqSelectMultiFormControlComponent
  extends SqFormControlBaseDirective
  implements OnInit, OnDestroy, OnChanges
{
  // ============================================================
  // Inputs - Aparência
  // ============================================================

  /**
   * Modo de exibição dos itens selecionados.
   * - 'default': Compacto, mostra "Item 1 +N mais"
   * - 'tags': Tags individuais removíveis com X
   */
  @Input() displayMode: 'default' | 'tags' = 'default';

  /**
   * Placeholder do campo de busca.
   */
  @Input() searchPlaceholder = 'Buscar...';

  /**
   * Cor de fundo.
   */
  @Input() backgroundColor = '';

  /**
   * Cor da borda.
   */
  @Input() borderColor = '';

  /**
   * Cor da label.
   */
  @Input() labelColor = '';

  /**
   * Largura do componente.
   */
  @Input() width = '100%';

  /**
   * Largura mínima.
   */
  @Input() minWidth = '200px';

  /**
   * Largura do dropdown.
   */
  @Input() dropdownWidth = '100%';

  /**
   * Altura máxima das tags (modo 'tags').
   */
  @Input() tagsMaxHeight = '100px';

  // ============================================================
  // Inputs - Comportamento
  // ============================================================

  /**
   * Mostra itens selecionados dentro do input.
   */
  @Input() showInside = true;

  /**
   * Oculta o campo de busca.
   */
  @Input() hideSearch = false;

  /**
   * Número máximo de seleções (apenas para controle visual, não valida).
   */
  @Input() maxSelections?: number;

  /**
   * Caracteres mínimos para busca.
   */
  @Input() minCharactersToSearch = 0;

  /**
   * Debounce da busca em ms.
   */
  @Input() searchDebounce = 300;

  /**
   * Opções disponíveis.
   */
  @Input() options: OptionMulti[] = [];

  /**
   * Indica carregamento.
   */
  @Input() loading = false;

  /**
   * Modo de busca: 'local' filtra client-side, 'remote' emite evento.
   */
  @Input() searchable?: 'local' | 'remote';

  /**
   * Indica se há mais itens para carregar (infinity scroll).
   */
  @Input() hasMore = false;

  /**
   * Habilita infinity scroll.
   */
  @Input() infiniteScroll = false;

  /**
   * Função customizada para trackBy.
   */
  @Input() trackByFn?: (index: number, option: OptionMulti) => unknown;

  /**
   * Se true, retorna o array de objetos OptionMulti completos como value.
   * Se false (padrão), retorna apenas um array com os values das Options selecionadas.
   */
  @Input() fullOptionAsValue = false;

  // ============================================================
  // Inputs - Data Test
  // ============================================================

  /**
   * Data test para o handle do select.
   */
  @Input() selectHandleDataTest = 'select-multi';

  /**
   * Data test para o input de busca.
   */
  @Input() selectInputDataTest = 'input-select-multi';

  /**
   * Data test para as opções.
   */
  @Input() optionDataTest = 'option-select-multi';

  // ============================================================
  // Outputs
  // ============================================================

  /**
   * Evento de busca (modo remote).
   */
  @Output() searchChange = new EventEmitter<string>();

  /**
   * Evento para carregar mais itens.
   */
  @Output() loadMore = new EventEmitter<void>();

  /**
   * Evento quando dropdown fecha.
   */
  @Output() closeChange = new EventEmitter<boolean>();

  /**
   * Evento quando uma tag é removida (modo 'tags').
   */
  @Output() removeTag = new EventEmitter<OptionMulti>();

  // ============================================================
  // Templates
  // ============================================================

  /**
   * Template customizado para o label.
   */
  @ContentChild('labelTemplate') labelTemplate: TemplateRef<HTMLElement> | null = null;

  /**
   * Template customizado para cada opção no dropdown.
   */
  @ContentChild('optionTemplate') optionTemplate: TemplateRef<unknown> | null = null;

  /**
   * Template customizado para exibição dos itens selecionados (modo default).
   */
  @ContentChild('selectedTemplate') selectedTemplate: TemplateRef<unknown> | null = null;

  /**
   * Template customizado para estado vazio.
   */
  @ContentChild('emptyTemplate') emptyTemplate: TemplateRef<HTMLElement> | null = null;

  /**
   * Template customizado para cada tag (modo tags).
   */
  @ContentChild('tagTemplate') tagTemplate: TemplateRef<unknown> | null = null;

  // ============================================================
  // Estado interno
  // ============================================================

  /**
   * Dropdown aberto.
   */
  isOpen = false;

  /**
   * Renderiza dropdown.
   */
  renderDropdown = false;

  /**
   * Texto de busca.
   */
  searchText = '';

  /**
   * Opções filtradas.
   */
  filteredOptions: OptionMulti[] = [];

  /**
   * Valor mudou desde abertura.
   */
  valueChanged = false;

  /**
   * Atingiu máximo de seleções.
   */
  isMaxSelections = false;

  /**
   * Subject para busca.
   */
  private searchSubject = new Subject<string>();

  /**
   * Mapa de fakeIds para trackBy.
   */
  private optionFakeIdMap = new WeakMap<OptionMulti, string>();

  /**
   * Contador para gerar fakeIds únicos.
   */
  private fakeIdCounter = 0;

  /**
   * Referência ao ChangeDetectorRef.
   */
  private cdr = inject(ChangeDetectorRef);

  /**
   * Referência ao ElementRef.
   */
  private elementRef = inject(ElementRef);

  /**
   * Construtor do componente.
   */
  constructor() {
    super();
    // Inicializa o control com array vazio em vez de string vazia
    this.control.setValue([] as any, { emitEvent: false });
    // Subscription para controle interno
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      const options = (value as OptionMulti[]) || [];
      // Se fullOptionAsValue for true, retorna o array de objetos completos
      // Caso contrário, retorna apenas um array com os values das Options
      if (this.fullOptionAsValue) {
        this.onChange(options);
      } else {
        this.onChange(options.map(opt => opt.value));
      }
      this.checkMaxSelections();
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
   * Inicialização do componente.
   */
  override ngOnInit(): void {
    super.ngOnInit();
    // Inicializa filteredOptions com options
    this.filteredOptions = this.options;
  }

  /**
   * Detecta mudanças nos inputs.
   *
   * @param changes - Mudanças detectadas.
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Atualiza filteredOptions quando options mudam (busca remota)
    if (changes['options'] && !changes['options'].firstChange) {
      this.filteredOptions = this.options;
      this.cdr.markForCheck();
    }
  }

  /**
   * Cleanup do componente.
   */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  // ============================================================
  // ControlValueAccessor (sobrescreve métodos do base class)
  // ============================================================

  /**
   * Escreve o valor no controle.
   *
   * @param value - Valor a ser escrito (pode ser array de OptionMulti ou array de values).
   */
  override writeValue(value: OptionMulti[] | any[] | null): void {
    if (!value || value.length === 0) {
      this.control.setValue([] as any, { emitEvent: false });
      this.checkMaxSelections();
      this.cdr.markForCheck();
      return;
    }

    // Verifica se é um array de objetos OptionMulti (tem propriedade 'value' e 'label')
    const isOptionMultiArray =
      typeof value[0] === 'object' && value[0] !== null && 'value' in value[0] && 'label' in value[0];

    // Se fullOptionAsValue for false e o valor for um array de primitivos,
    // precisa converter para array de OptionMulti procurando nas options
    if (!this.fullOptionAsValue && !isOptionMultiArray) {
      const options = this.options.filter(opt => (value as any[]).includes(opt.value));
      this.control.setValue(options as any, { emitEvent: false });
    } else {
      // Se fullOptionAsValue for true ou já for array de objetos OptionMulti
      this.control.setValue(value as OptionMulti[] as any, { emitEvent: false });
    }

    this.checkMaxSelections();
    this.cdr.markForCheck();
  }

  /**
   * Registra callback de mudança de valor.
   *
   * @param fn - Callback.
   */
  override registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  /**
   * Define estado disabled.
   *
   * @param isDisabled - Se está desabilitado.
   */
  override setDisabledState(isDisabled: boolean): void {
    super.setDisabledState(isDisabled);
    this.cdr.markForCheck();
  }

  // ============================================================
  // Getters
  // ============================================================

  /**
   * Retorna o valor atual do controle.
   */
  override get value(): OptionMulti[] {
    return (this.control.value as unknown as OptionMulti[]) || [];
  }

  /**
   * Retorna as opções a serem exibidas (filtradas ou não).
   */
  get displayOptions(): OptionMulti[] {
    if (this.searchable === 'local' && this.searchText) {
      return this.filterOptionsLocally(this.searchText);
    }
    return this.filteredOptions;
  }

  /**
   * Retorna o texto resumido para exibição (modo default).
   */
  get summaryText(): string {
    const values = this.value;
    if (!values.length) return '';
    if (values.length === 1) return values[0].label;
    return `${values[0].label} +${values.length - 1}`;
  }

  // ============================================================
  // Métodos públicos - Dropdown
  // ============================================================

  /**
   * Alterna o estado do dropdown (abre/fecha).
   */
  async toggleDropdown(): Promise<void> {
    if (this.disabled || this.readonly || this.isMaxSelections) return;

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

    // Se modo remote e lista vazia, emite busca inicial (primeira página)
    if (this.searchable === 'remote' && this.options.length === 0) {
      this.searchChange.emit('');
    }

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
    this.closeChange.emit(this.valueChanged);
    this.valueChanged = false;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.renderDropdown = false;
      this.cdr.detectChanges();
    }, 200);
  }

  // ============================================================
  // Métodos públicos - Seleção
  // ============================================================

  /**
   * Verifica se uma opção está selecionada.
   *
   * @param option - A opção a verificar.
   * @returns true se a opção está selecionada.
   */
  isSelected(option: OptionMulti): boolean {
    return this.value.some(v => v.value === option.value);
  }

  /**
   * Alterna a seleção de uma opção.
   *
   * @param option - A opção a ser alternada.
   * @param event - Evento opcional com estado checked.
   */
  toggleOption(option: OptionMulti, event?: { value: boolean; checked: boolean } | boolean): void {
    if (option.disabled) return;

    // Normaliza o evento - se não fornecido, inverte o estado atual
    let checked: boolean;
    if (event === undefined) {
      checked = !this.isSelected(option);
    } else {
      checked = typeof event === 'boolean' ? event : event.checked;
    }

    let newValue = [...this.value];

    if (checked) {
      if (!this.isSelected(option)) {
        newValue.push(option);
      }
      // Adiciona filhos se existirem
      if (option.children?.length) {
        option.children.forEach(child => {
          if (!newValue.some(v => v.value === child.value)) {
            newValue.push(child);
          }
        });
      }
    } else {
      newValue = newValue.filter(v => v.value !== option.value);
      // Remove filhos se existirem
      if (option.children?.length) {
        const childValues = option.children.map(c => c.value);
        newValue = newValue.filter(v => !childValues.includes(v.value));
      }
    }

    this.control.setValue(newValue as any);
    this.valueChanged = true;
    this.cdr.markForCheck();
  }

  /**
   * Remove uma tag (modo 'tags').
   */
  removeItem(option: OptionMulti, event?: Event): void {
    event?.stopPropagation();
    if (this.readonly || this.disabled) return;

    let newValue = this.value.filter(v => v.value !== option.value);

    // Remove filhos também
    if (option.children?.length) {
      const childValues = option.children.map(c => c.value);
      newValue = newValue.filter(v => !childValues.includes(v.value));
    }

    this.control.setValue(newValue as any);
    this.removeTag.emit(option);
  }

  /**
   * Verifica se algum filho está selecionado.
   */
  hasSelectedChildren(option: OptionMulti): boolean {
    if (!option.children?.length) return false;
    return option.children.some(child => this.isSelected(child));
  }

  /**
   * Toggle para expandir/colapsar hierarquia.
   */
  toggleCollapse(option: OptionMulti): void {
    option.open = !option.open;
  }

  // ============================================================
  // Métodos públicos - Busca
  // ============================================================

  /**
   * Handler para input de busca.
   *
   * @param event - Evento de input.
   */
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const term = input.value;
    this.searchText = term;

    if (this.minCharactersToSearch && term.length < this.minCharactersToSearch) {
      return;
    }

    if (this.searchable === 'local') {
      this.filteredOptions = this.filterOptionsLocally(term);
      this.cdr.markForCheck();
    } else if (this.searchable === 'remote') {
      this.searchSubject.next(term);
    }
  }

  // ============================================================
  // Métodos públicos - Scroll
  // ============================================================

  /**
   * Handler de scroll para infinity scroll (lista simples).
   *
   * @param event - Evento de scroll.
   */
  onScroll(event: Event): void {
    if (!this.infiniteScroll || !this.hasMore || this.loading) return;

    const element = event.target as HTMLElement;
    const scrollBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    if (scrollBottom < 100) {
      this.loadMore.emit();
    }
  }

  /**
   * Handler de scroll para infinity scroll (virtual scroll).
   */
  onVirtualScroll(): void {
    if (!this.infiniteScroll || !this.hasMore || this.loading) return;

    const viewport = this.elementRef.nativeElement.querySelector('cdk-virtual-scroll-viewport');
    if (viewport) {
      const scrollBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      if (scrollBottom < 100) {
        this.loadMore.emit();
      }
    }
  }

  /**
   * Função trackBy para ngFor.
   *
   * @param index - Índice do item.
   * @param option - Opção.
   * @returns Identificador único da opção.
   */
  trackByValue = (index: number, option: OptionMulti): unknown => {
    if (this.trackByFn) {
      return this.trackByFn(index, option);
    }
    return this.getOptionFakeId(option);
  };

  // ============================================================
  // Métodos públicos - Eventos
  // ============================================================

  /**
   * Handler de blur.
   *
   * @param event - Evento de blur.
   */
  override onBlur(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (relatedTarget && this.elementRef.nativeElement.contains(relatedTarget)) {
      return;
    }
    super.onBlur(event);
  }

  /**
   * Handler de focus.
   *
   * @param event - Evento de focus.
   */
  override onFocus(event: FocusEvent): void {
    super.onFocus(event);
  }

  // ============================================================
  // Métodos privados
  // ============================================================

  /**
   * Filtra opções localmente pelo termo de busca.
   *
   * @param term - Termo de busca.
   * @returns Opções filtradas.
   */
  private filterOptionsLocally(term: string): OptionMulti[] {
    if (!term) return this.options;

    const lowerTerm = term.toLowerCase();
    return this.options.filter(opt => {
      const matchesLabel = opt.label.toLowerCase().includes(lowerTerm);
      const matchesChildren = opt.children?.some(child => child.label.toLowerCase().includes(lowerTerm));
      return matchesLabel || matchesChildren;
    });
  }

  /**
   * Verifica e atualiza estado de máximo de seleções.
   */
  private checkMaxSelections(): void {
    if (this.maxSelections) {
      this.isMaxSelections = this.value.length >= this.maxSelections;
      if (this.isMaxSelections && this.isOpen) {
        this.closeDropdown();
      }
    } else {
      this.isMaxSelections = false;
    }
  }

  /**
   * Obtém ou gera um fakeId para a opção (para trackBy).
   *
   * @param option - Opção.
   * @returns FakeId da opção.
   */
  private getOptionFakeId(option: OptionMulti): string {
    let fakeId = this.optionFakeIdMap.get(option);
    if (!fakeId) {
      fakeId = `option-${++this.fakeIdCounter}`;
      this.optionFakeIdMap.set(option, fakeId);
    }
    return fakeId;
  }
}
