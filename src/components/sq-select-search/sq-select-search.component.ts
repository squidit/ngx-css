import { SqDataTestDirective } from './../../directives/sq-data-test/sq-data-test.directive';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
  TrackByFunction,
} from '@angular/core';
import { DOCUMENT, NgClass, NgStyle, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateService } from '@ngx-translate/core';
import { useMemo } from '../../helpers/memo.helper';
import { Option } from '../../interfaces/option.interface';
import { SqLoaderComponent } from '../sq-loader/sq-loader.component';
import { SqTooltipComponent } from '../sq-tooltip/sq-tooltip.component';
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';
import { TranslateInternalPipe } from '../../pipes/translate-internal/translate-internal.pipe';
import { SearchPipe } from '../../pipes/search/search.pipe';
import { SqClickOutsideDirective } from '../../directives/sq-click-outside/sq-click-outside.directive';

/**
 * Represents a search-based select component.
 *
 * @example
 * <sq-select-search
 *   [name]="'search'"
 *   [value]="selectedOption"
 *   [options]="searchOptions"
 *   (valueChange)="handleOptionSelection($event)"
 *   (searchChange)="handleSearch($event)"
 * >
 * </sq-select-search>
 */
@Component({
  selector: 'sq-select-search',
  templateUrl: './sq-select-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./sq-select-search.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    NgTemplateOutlet,
    AsyncPipe,
    FormsModule,
    ScrollingModule,
    SqLoaderComponent,
    SqTooltipComponent,
    UniversalSafePipe,
    TranslateInternalPipe,
    SearchPipe,
    SqClickOutsideDirective,
    SqDataTestDirective,
  ],
  providers: [],
})
export class SqSelectSearchComponent implements OnChanges, AfterViewInit, OnDestroy {
  /**
   * The name attribute for the search-based select input.
   */
  @Input() name = `random-name-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`;
  /**
   * The selected value for the search-based select input.
   */
  @Input() value?: Option;

  /**
   * The id attribute for the search-based select input.
   */
  @Input() id?: string;

  /**
   * The label for the search-based select input.
   */
  @Input() label = '';

  /**
   * Custom CSS class for styling the component.
   */
  @Input() customClass = '';

  /**
   * Placeholder text for the input field.
   */
  @Input() placeholder = '';

  /**
   * External error message for the search-based select input.
   */
  @Input() externalError = '';

  /**
   * External icon for the search-based select input.
   */
  @Input() externalIcon = '';

  /**
   * Placeholder text for the search input field.
   */
  @Input() placeholderSearch = '';

  /**
   * Indicates whether the search-based select input is disabled.
   */
  @Input() disabled = false;

  /**
   * Indicates whether the search-based select input is readonly.
   */
  @Input() readonly = false;

  /**
   * Indicates whether the search-based select input is required.
   */
  @Input() required = false;

  /**
   * Indicates whether the search-based select input is in a loading state.
   */
  @Input() loading = false;

  /**
   * Indicates whether to use form errors for validation.
   */
  @Input() useFormErrors = true;

  /**
   * Indicates whether to display an error span.
   */
  @Input() errorSpan = true;

  /**
   * Indicates whether to append the dropdown to the body when opened.
   * Useful for modals and containers with overflow restrictions.
   * @default false
   */
  @Input() appendOnBody = false;

  /**
   * Minimum number of characters to perform the searchChange.
   */
  @Input() minCharactersToSearch = 0;

  /**
   * The time interval for input timeout in ms.
   */
  @Input() timeToChange = 800;

  /**
   * Options available for selection.
   */
  @Input() options: Array<Option> = [];

  /**
   * Background color for the search-based select input.
   */
  @Input() backgroundColor = '';

  /**
   * Border color for the search-based select input.
   */
  @Input() borderColor = '';

  /**
   * Color for the label of the search-based select input.
   */
  @Input() labelColor = '';

  /**
   * Tooltip message for the search-based select input.
   */
  @Input() tooltipMessage = '';

  /**
   * Tooltip placement for the search-based select input.
   */
  @Input() tooltipPlacement: 'center top' | 'center bottom' | 'left center' | 'right center' = 'right center';

  /**
   * Tooltip color for the search-based select input.
   */
  @Input() tooltipColor = 'inherit';

  /**
   * Tooltip icon for the search-based select input.
   */
  @Input() tooltipIcon = '';

  /**
   * The data-test attribute value for the select search element.
   *
   * @default 'select-search'
   */
  @Input() selectHandleDataTest = 'select-search';

  /**
   * The data-test attribute value for the select input element.
   *
   * @default 'input-select-search'
   */
  @Input() selectInputDataTest = 'input-select-search';

  /**
   * The data-test attribute value for the select option elements.
   *
   * @default 'option-select-search'
   */
  @Input() SelectOptionDataTest = 'option-select-search';

  /**
   * Event emitted when the selected value changes.
   */
  @Output() valueChange: EventEmitter<Option> = new EventEmitter();

  /**
   * Event emitted when the search input value changes.
   */
  @Output() searchChange: EventEmitter<string> = new EventEmitter();

  /**
   * Event emitted when the search-based select input becomes valid or invalid.
   */
  @Output() valid: EventEmitter<boolean> = new EventEmitter();

  /**
   * The label template for the search-based select input.
   */
  @ContentChild('labelTemplate')
  labelTemplate: TemplateRef<HTMLElement> | null = null;

  /**
   * The select empty template for the search-based select input.
   */
  @ContentChild('selectEmptyTemplate')
  selectEmptyTemplate: TemplateRef<HTMLElement> | null = null;

  /**
   * Error message associated with the search-based select input.
   */
  error: boolean | string = '';

  /**
   * Native element reference.
   */
  nativeElement: ElementRef;

  /**
   * Text entered in the search input field.
   */
  searchText = '';

  /**
   * Indicates when is the time to render the multi-tag select dropdown.
   */
  renderOptionsList = false;

  /**
   * Indicates whether the dropdown is open.
   */
  open = false;

  /**
   * Control options to render
   */
  _options: Array<Option> = [];

  /**
   * Timeout for input changes.
   */
  timeoutInput!: ReturnType<typeof setTimeout>;

  /**
   * The height for the cdk-virtual-scroll-viewport (default 305px).
   */
  cdkVirtualScrollViewportHeight = '305px';

  /**
   * Reference to the input fake content element (used for positioning).
   */
  private inputFakeContent?: HTMLElement;

  /**
   * Reference to the dropdown window element.
   */
  private dropdownWindow?: HTMLElement;

  /**
   * Original parent node of the dropdown (to restore when closing).
   */
  private originalParent: Node | null = null;

  /**
   * Wrapper element created in body to maintain CSS context.
   */
  private bodyWrapper?: HTMLElement;

  /**
   * Indicates if the dropdown is currently attached to body.
   */
  private isAttachedToBody = false;

  /**
   * Constructs a new SqSelectSearchComponent.
   *
   * @param {ElementRef} element - The element reference.
   * @param {TranslateService} translate - The optional TranslateService for internationalization.
   * @param {ChangeDetectorRef} changeDetector - Base class that provides change detection functionality.
   * @param {Document} document - The document object for DOM manipulation.
   */
  constructor(
    public element: ElementRef,
    @Optional() private translate: TranslateService,
    private changeDetector: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.nativeElement = element.nativeElement;
  }

  /**
   * Lifecycle hook called after the view is initialized.
   */
  ngAfterViewInit(): void {
    // Inicializa elementos apenas se appendOnBody estiver ativado
    if (this.appendOnBody) {
      setTimeout(() => {
        this.initializeDropdownElements();
      }, 100);
    }
  }

  /**
   * Lifecycle hook called when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.cleanupDropdownAttachment();
  }

  /**
   * Initializes references to dropdown elements.
   */
  private initializeDropdownElements(): void {
    const nativeElement = this.element.nativeElement as HTMLElement;

    // Se o dropdown está anexado ao body, procura primeiro no bodyWrapper
    if (this.isAttachedToBody && this.bodyWrapper) {
      this.dropdownWindow = this.bodyWrapper.querySelector('.input-window') as HTMLElement;
    } else {
      // Caso contrário, procura no elemento nativo
      this.dropdownWindow = nativeElement.querySelector('.input-window') as HTMLElement;
    }

    this.inputFakeContent = nativeElement.querySelector('.input-fake-content') as HTMLElement;

    // Sempre atualiza o originalParent para o local correto (dentro do .input-fake)
    if (this.dropdownWindow && !this.isAttachedToBody) {
      const inputFake = nativeElement.querySelector('.input-fake');
      if (inputFake) {
        // Se o dropdown não está dentro do input-fake, não atualiza originalParent ainda
        // (pode estar no bodyWrapper)
        if (inputFake.contains(this.dropdownWindow) || this.dropdownWindow.parentNode === inputFake) {
          this.originalParent = inputFake;
        }
      }
    }
  }

  /**
   * Lifecycle hook called when any input properties change.
   *
   * @param changes - The changes detected in the component's input properties.
   */
  async ngOnChanges(changes: SimpleChanges) {
    if (this.open && changes.hasOwnProperty('options')) {
      this.verifyNewOptions();
    }

    // Se appendOnBody mudou e o dropdown está aberto, reanexa ao body
    if (changes.hasOwnProperty('appendOnBody') && this.open && this.appendOnBody) {
      setTimeout(() => {
        this.attachDropdownToBody();
      }, 50);
    }
  }

  /**
   * Emits the selected value and closes the dropdown.
   *
   * @param {any} event - The event containing the selected value.
   */
  emit(event: any) {
    this.value = event;
    this.valueChange.emit(this.value);
    this.validate();
    this.closeDropdown();
  }

  /**
   * Validates the search-based select input and sets the error state.
   */
  validate() {
    if (this.externalError) {
      this.error = false;
    } else if (this.required && !this.value) {
      this.setError('forms.required');
      this.valid.emit(false);
    } else {
      this.valid.emit(true);
      this.error = '';
    }
  }

  /**
   * Do action to open or close thw dropdown list
   */
  async doDropDownAction() {
    if (this.open) {
      this.closeDropdown();
      this.renderOptionsList = await new Promise<boolean>(resolve =>
        setTimeout(() => {
          resolve(false);
        }, 300)
      );
      this.changeDetector.detectChanges();
    } else {
      this.verifyNewOptions();
      this.renderOptionsList = true;
      this.open = await new Promise<boolean>(resolve =>
        setTimeout(() => {
          resolve(true);
        }, 100)
      );
      this.changeDetector.detectChanges();

      // Anexa o dropdown ao body após abrir apenas se appendOnBody estiver ativado
      if (this.appendOnBody) {
        setTimeout(() => {
          this.attachDropdownToBody();
        }, 150);
      }
    }
  }

  /**
   * Closes the dropdown and resets the search text.
   */
  closeDropdown() {
    this.open = false;
    this._options = [];
    this.searchText = '';

    // Remove o dropdown do body e retorna ao local original apenas se appendOnBody estiver ativado
    if (this.appendOnBody) {
      this.detachDropdownFromBody();
    }
  }

  /**
   * Anexa o dropdown ao body quando aberto (como um portal/overlay).
   * Isso resolve problemas de overflow em modais e outros containers.
   */
  private attachDropdownToBody(): void {
    // Sempre inicializa os elementos para garantir que estão atualizados
    this.initializeDropdownElements();

    if (!this.dropdownWindow || !this.inputFakeContent) {
      return;
    }

    // Se já está anexado, apenas atualiza a posição
    if (this.isAttachedToBody && this.bodyWrapper) {
      this.updateDropdownPosition();
      return;
    }

    // Garante que o originalParent está correto antes de mover
    if (!this.originalParent) {
      const nativeElement = this.element.nativeElement as HTMLElement;
      const inputFake = nativeElement.querySelector('.input-fake');
      if (inputFake) {
        this.originalParent = inputFake;
      } else {
        this.originalParent = this.dropdownWindow.parentNode;
      }
    }

    // Obtém a posição do input
    const inputRect = this.inputFakeContent.getBoundingClientRect();
    const scrollPos =
      window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;

    // Calcula a posição baseada no input
    const top = inputRect.bottom + scrollPos;
    const left = inputRect.left;
    const width = inputRect.width;

    // Remove wrapper antigo se existir (limpeza)
    if (this.bodyWrapper && this.bodyWrapper.parentNode) {
      this.bodyWrapper.parentNode.removeChild(this.bodyWrapper);
    }

    // Cria um wrapper no body com a classe wrapper-select-search para manter o contexto CSS
    this.bodyWrapper = this.document.createElement('div');
    this.bodyWrapper.className = 'wrapper-select-search';
    this.bodyWrapper.style.position = 'fixed';
    this.bodyWrapper.style.top = `${top}px`;
    this.bodyWrapper.style.left = `${left}px`;
    this.bodyWrapper.style.width = `${width}px`;
    this.bodyWrapper.style.zIndex = '1100';
    this.bodyWrapper.style.pointerEvents = 'none';

    // Move o dropdown para dentro do wrapper
    this.bodyWrapper.appendChild(this.dropdownWindow);

    // Anexa o wrapper ao body
    this.document.body.appendChild(this.bodyWrapper);
    this.isAttachedToBody = true;

    // Habilita pointer events no dropdown (mas não no wrapper)
    this.dropdownWindow.style.pointerEvents = 'auto';

    // Adiciona listener para atualizar posição em scroll/resize
    window.addEventListener('scroll', this.updateDropdownPosition, true);
    window.addEventListener('resize', this.updateDropdownPosition);
  }

  /**
   * Remove o dropdown do body e retorna ao local original.
   */
  private detachDropdownFromBody(): void {
    if (!this.isAttachedToBody || !this.bodyWrapper) {
      return;
    }

    // Remove listeners
    window.removeEventListener('scroll', this.updateDropdownPosition, true);
    window.removeEventListener('resize', this.updateDropdownPosition);

    // O dropdown deve estar dentro do bodyWrapper
    if (this.dropdownWindow && this.bodyWrapper.contains(this.dropdownWindow)) {
      // Remove estilos inline do dropdown
      this.dropdownWindow.style.pointerEvents = '';

      // Encontra o local correto para retornar o dropdown
      const nativeElement = this.element.nativeElement as HTMLElement;
      const inputFake = nativeElement.querySelector('.input-fake');

      if (inputFake) {
        // Retorna para o input-fake (local original)
        inputFake.appendChild(this.dropdownWindow);
        this.originalParent = inputFake;
      } else if (this.originalParent && this.originalParent.parentNode) {
        // Se input-fake não existe, tenta usar originalParent
        this.originalParent.appendChild(this.dropdownWindow);
      }
    }

    // Remove o wrapper do body
    if (this.bodyWrapper.parentNode) {
      this.bodyWrapper.parentNode.removeChild(this.bodyWrapper);
    }
    this.bodyWrapper = undefined;
    this.isAttachedToBody = false;
  }

  /**
   * Atualiza a posição do dropdown quando há scroll ou resize.
   * Usado como callback, por isso precisa ser arrow function.
   */
  private updateDropdownPosition = (): void => {
    if (!this.dropdownWindow || !this.inputFakeContent || !this.isAttachedToBody || !this.bodyWrapper) {
      return;
    }

    const inputRect = this.inputFakeContent.getBoundingClientRect();
    const scrollPos =
      window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;

    // Atualiza a posição do wrapper
    this.bodyWrapper.style.top = `${inputRect.bottom + scrollPos}px`;
    this.bodyWrapper.style.left = `${inputRect.left}px`;
    this.bodyWrapper.style.width = `${inputRect.width}px`;
  };

  /**
   * Limpa os event listeners quando o componente é destruído.
   */
  private cleanupDropdownAttachment(): void {
    // Remove listeners de scroll/resize
    window.removeEventListener('scroll', this.updateDropdownPosition, true);
    window.removeEventListener('resize', this.updateDropdownPosition);

    // Retorna dropdown ao local original se ainda estiver anexado ao body
    if (this.isAttachedToBody) {
      this.detachDropdownFromBody();
    }

    // Limpa o wrapper se ainda existir
    if (this.bodyWrapper && this.bodyWrapper.parentNode) {
      this.bodyWrapper.parentNode.removeChild(this.bodyWrapper);
      this.bodyWrapper = undefined;
    }
  }

  /**
   * Return trackBy for ngFor
   */
  trackByOptValue: TrackByFunction<any> = useMemo((index, opt) => opt.value);

  /**
   * Handles changes to the search input value.
   *
   * @param {string} event - The search input value.
   */
  async onTipSearchChange(event: string) {
    if (!this.minCharactersToSearch || !event.length || event.length >= this.minCharactersToSearch) {
      clearTimeout(this.timeoutInput);
      this.searchText =
        (await new Promise<string>(
          resolve =>
            (this.timeoutInput = setTimeout(() => {
              resolve(event);
            }, this.timeToChange))
        )) || '';
      this.searchChange.emit(event);
      this.changeDetector.detectChanges();
    }
  }

  /**
   * Sets an error message.
   *
   * @param {string} key - The translation key for the error message.
   */
  async setError(key: string) {
    if (this.useFormErrors && this.translate) {
      this.error = await this.translate.instant(key);
    }
  }

  /**
   * Verify new options and set the cdkVirtualScrollViewportHeight
   */
  verifyNewOptions() {
    this._options = this.options;
    if (!this._options.length) {
      this.cdkVirtualScrollViewportHeight = '12px';
    } else if (this._options.length < 15) {
      this.cdkVirtualScrollViewportHeight = this._options.length * 32 + 'px';
    } else {
      this.cdkVirtualScrollViewportHeight = '305px';
    }
  }
}
