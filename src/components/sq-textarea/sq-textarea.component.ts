import { Component, ContentChild, ElementRef, EventEmitter, Input, Optional, Output, TemplateRef } from "@angular/core"
import { ValidatorHelper } from '../../helpers/validator.helper'
import { TranslateService } from '@ngx-translate/core'

/**
 * Represents a textarea input component with various configuration options.
 *
 * Look the link about the component in original framework and the appearance
 *
 * @see {@link https://css.squidit.com.br/forms/textarea}
 * 
 * <div class='col-6 my-3'>
 *  <label class='display-block' for='textarea-text'>
 *    Label
 *  </label>
 *  <div class='wrapper-input mb-3'>
 *    <textarea
 *      class='display-block textarea'
 *      type='text'
 *      name='textarea-text'
 *      id='textarea-text'
 *      placeholder='Placeholder'
 *    ></textarea>
 *  </div>
 *</div>
 * 
 * @example
 * <sq-textarea [name]="'description'" [id]="'description'" [label]="'Description'"[placeholder]="'Enter a description...'" [(value)]="text"></sq-textarea>
 *
 */
@Component({
  selector: 'sq-textarea',
  templateUrl: './sq-textarea.component.html',
  styleUrls: ['./sq-textarea.component.scss']
})
export class SqTextAreaComponent {
  /**
   * The name attribute of the textarea.
   * 
   * @default 'random-name-[hash-random-code]'
   */
  @Input() name = `random-name-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`

  /**
   * The id attribute of the textarea.
   */
  @Input() id?: string

  /**
   * The label to display for the textarea.
   */
  @Input() label?: string

  /**
   * Additional CSS classes for styling the textarea.
   */
  @Input() customClass = ''

  /**
   * The placeholder text to display in the textarea.
   */
  @Input() placeholder = ''

  /**
   * External error message to display for the textarea.
   */
  @Input() externalError = ''

  /**
   * External icon to display for the textarea.
   */
  @Input() externalIcon = ''

  /**
   * The initial value of the textarea.
   */
  @Input() value: any = ''

  /**
   * The time interval for input timeout in ms.
   */
  @Input() timeToChange = 0

  /**
   * Flag to show an error span.
   */
  @Input() errorSpan = true

  /**
   * Flag to disable the textarea.
   */
  @Input() disabled = false

  /**
   * Flag to make the textarea readonly.
   */
  @Input() readonly = false

  /**
   * Flag to mark the textarea as required.
   */
  @Input() required = false

  /**
   * Flag to use form errors for validation.
   */
  @Input() useFormErrors = true

  /**
   * The tooltip message to display.
   */
  @Input() tooltipMessage = ''

  /**
   * The placement of the tooltip.
   */
  @Input() tooltipPlacement: 'center top' | 'center bottom' | 'left center' | 'right center' = 'right center'

  /**
   * The color of the tooltip.
   */
  @Input() tooltipColor = 'inherit'

  /**
   * The icon to display in the tooltip.
   */
  @Input() tooltipIcon = ''

  /**
   * The background color of the textarea.
   */
  @Input() backgroundColor = ''

  /**
   * The border color of the textarea.
   */
  @Input() borderColor = ''

  /**
   * The color of the textarea label.
   */
  @Input() labelColor = ''

  /**
   * The maximum length of the textarea.
   */
  @Input() maxLength: number | null = null

  /**
   * Event emitted when a key is pressed down in the textarea.
   */
  @Output() keyPressDown: EventEmitter<KeyboardEvent> = new EventEmitter()

  /**
   * Event emitted when a key is released in the textarea.
   */
  @Output() keyPressUp: EventEmitter<KeyboardEvent> = new EventEmitter()

  /**
   * Event emitted when the textarea gains or loses focus.
   */
  @Output() inFocus: EventEmitter<boolean> = new EventEmitter()

  /**
   * Event emitted when the textarea value changes.
   */
  @Output() valueChange: EventEmitter<any> = new EventEmitter()

  /**
   * Event emitter for validation status.
   */
  @Output() valid: EventEmitter<boolean> = new EventEmitter()

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
   * Represents the error state of the textarea.
   */
  error: boolean | string = false

  /**
   * Reference to the native element of the textarea.
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
    public element: ElementRef,
    @Optional() public translate: TranslateService
  ) {
    this.nativeElement = element.nativeElement
  }

  /**
   * Asynchronously validates the input value.
   */
  async validate(isBlur = false) {
    if (isBlur) {
      this.inFocus.emit(false)
    }
    if (this.externalError) {
      this.error = false
    } else if (this.required && !this.value) {
      this.valid.emit(false)
      this.setError('forms.required')
    } else {
      this.valid.emit(true)
      this.error = ''
    }
  }

  /**
   * Handles changes to the textarea value.
   *
   * @param {string} event - The new value of the textarea.
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
   * Asynchronously sets an error message.
   *
   * @param {string} key - The key for the error message.
   */
  async setError(key: string) {
    if (this.useFormErrors && this.translate) {
      this.error = await this.translate.instant(key)
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