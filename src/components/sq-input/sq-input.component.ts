import { Component, ContentChild, ElementRef, EventEmitter, Input, Optional, Output, TemplateRef } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ValidatorHelper } from '../../helpers/validator.helper'

/**
 * Represents the SqInputComponent, a customizable input component.
 *
 * Look the link about the component in original framework and the appearance
 *
 * @see {@link https://css.squidit.com.br/forms/input}
 *
 * <br>
 * <label for='id-exemple'>
 *  Example Input
 * </label>
 * <input
 *   class='input mb-3'
 *   name="name-exemple"
 *   id="id-exemple"
 *   placeholder="Enter text"
 * ></input>
 *
 * @example
 * <sq-input
 *   [name]="'name-exemple'"
 *   [id]="'id-exemple'"
 *   [label]="'Example Input'"
 *   [placeholder]="'Enter text'"
 *   [(value)]="inputValue"
 *   [required]="true"
 *   (valueChange)="onInputChange($event)"
 * ></sq-input>
 */
@Component({
  selector: 'sq-input',
  templateUrl: './sq-input.component.html',
  styleUrls: ['./sq-input.component.scss']
})
export class SqInputComponent {
  /**
   * The name attribute for the input element.
   *
   * @default 'random-name-[hash-random-code]'
   */
  @Input() name = `random-name-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`

  /**
   * The id attribute for the input element.
   */
  @Input() id?: string

  /**
   * An optional label for the input.
   */
  @Input() label?: string

  /**
   * Custom CSS class for the input element.
   */
  @Input() customClass = ''

  /**
   * Placeholder text for the input element.
   */
  @Input() placeholder = ''

  /**
   * External error message to display.
   */
  @Input() externalError = ''

  /**
   * External icon to display.
   */
  @Input() externalIcon = ''

  /**
   * The value of the input element.
   */
  @Input()
  public set value(value: any) {
    this._value = value
  }
  public get value(): any {
    return this._value
  }

  /**
   * Time in milliseconds before triggering input timeout.
   */
  @Input() timeToChange = 0

  /**
   * Flag to display an error span.
   */
  @Input() errorSpan = true

  /**
   * Flag to disable the input element.
   */
  @Input() disabled = false

  /**
   * Flag to make the input element readonly.
   */
  @Input() readonly = false

  /**
   * Flag to mark the input as required.
   */
  @Input() required = false

  /**
   * Flag to use form errors for validation messages.
   */
  @Input() useFormErrors = true

  /**
   * Tooltip message to display.
   */
  @Input() tooltipMessage = ''

  /**
   * Placement of the tooltip.
   */
  @Input() tooltipPlacement: 'center top' | 'center bottom' | 'left center' | 'right center' = 'right center'

  /**
   * Color of the tooltip.
   */
  @Input() tooltipColor = 'inherit'

  /**
   * Icon for the tooltip.
   */
  @Input() tooltipIcon = ''

  /**
   * Background color of the input element.
   */
  @Input() backgroundColor = ''

  /**
   * Border color of the input element.
   */
  @Input() borderColor = ''

  /**
   * Color of the input label.
   */
  @Input() labelColor = ''

  /**
   * Type of the input element (e.g., text, email, password).
   */
  @Input() type: 'text' | 'email' | 'hidden' | 'password' | 'tel' | 'url' | 'file' = 'text'

  /**
   * Maximum length for the input element.
   */
  @Input() maxLength: number | null = null

  /**
   * Regular expression pattern for input validation.
   */
  @Input() pattern = ''

  /**
   * Input mode for mobile devices.
   */
  @Input() inputMode = ''

  /**
   * Event emitter for keydown events.
   */
  @Output() keyPressDown: EventEmitter<KeyboardEvent> = new EventEmitter()

  /**
   * Event emitter for keyup events.
   */
  @Output() keyPressUp: EventEmitter<KeyboardEvent> = new EventEmitter()

  /**
   * Event emitter for input focus events.
   */
  @Output() inFocus: EventEmitter<boolean> = new EventEmitter()

  /**
   * Event emitter for validation status.
   */
  @Output() valid: EventEmitter<boolean> = new EventEmitter()

  /**
   * Event emitter for input value changes.
   */
  @Output() valueChange: EventEmitter<any> = new EventEmitter()

  /**
   * Reference to a left-aligned label template.
   */
  @ContentChild('leftLabel')
  leftLabel: TemplateRef<HTMLElement> | null = null

  /**
   * Reference to a right-aligned label template.
   */
  @ContentChild('rightLabel')
  rightLabel: TemplateRef<HTMLElement> | null = null

  /**
   * Reference to a label template.
   */
  @ContentChild('labelTemplate')
  labelTemplate: TemplateRef<HTMLElement> | null = null

  /**
   * The internal value of the input element.
   */
  _value: any = ''

  /**
   * Error message to display.
   */
  error: boolean | string = false

  /**
   * Reference to the native element.
   */
  nativeElement: ElementRef

  /**
   * Timeout for input changes.
   */
  timeoutInput!: ReturnType<typeof setTimeout>

  /**
   * Constructor for the SqInputComponent class.
   * @param validatorHelper - The ValidatorHelper service for input validation.
   * @param element - The ElementRef representing the input element.
   * @param translate - The TranslateService for internationalization (optional).
   */
  constructor(
    public validatorHelper: ValidatorHelper,
    element: ElementRef,
    @Optional() public translate: TranslateService,
  ) {
    this.nativeElement = element.nativeElement
  }

  /**
   * Asynchronously validate the input value.
   * @param isBlur - Indicates if the input has lost focus.
   */
  async validate(isBlur = false) {
    if (this.externalError) {
      this.error = false
    } else if (!!this.required && !this.value) {
      this.valid.emit(false)
      this.setError('forms.required')
    } else if (this.type === 'email' && !this.validatorHelper.email(this.value)) {
      this.valid.emit(false)
      this.setError('forms.email')
    } else if (this.type === 'tel' && !this.validatorHelper.phone(this.value)) {
      this.valid.emit(false)
      this.setError('forms.phone')
    } else if (this.type === 'url' && this.value && this.value.length && !this.validatorHelper.url(this.value)) {
      this.valid.emit(false)
      this.setError('forms.url')
    } else {
      this.valid.emit(true)
      this.error = ''
    }

    if (isBlur) {
      this.inFocus.emit(false)
    }
  }

  /**
   * Handle input value changes.
   * @param event - The input change event.
   */
  async change(event: any) {
    this.inFocus.emit(true)
    this.value = event
    clearTimeout(this.timeoutInput)
    this.timeoutInput = setTimeout(() => {
      this.valueChange.emit(event)
    }, this.timeToChange)
    this.validate()
  }

  /**
   * Sets an error message.
   *
   * @param {string} key - The translation key for the error message.
   * @param interpolateParams - Value to interpolate with translation.
   */
  async setError(key: string, interpolateParams: Object = {}) {
    if (this.useFormErrors && this.translate) {
      this.error = await this.translate.instant(key, interpolateParams)
    }
  }

  /**
   * Handle keydown events.
   * @param event - The keydown event.
   */
  keyDown(event: KeyboardEvent) {
    this.keyPressDown.emit(event)
  }

  /**
   * Handle keyup events.
   * @param event - The keyup event.
   */
  keyUp(event: KeyboardEvent) {
    this.keyPressUp.emit(event)
  }
}
