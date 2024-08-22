import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef, Optional, ElementRef } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Option } from '../../interfaces/option.interface'

/**
 * Represents a select input component for choosing options from a dropdown.
 *
 * Look the link about the component in original framework and the appearance
 *
 * @see {@link https://css.squidit.com.br/forms/select}
 * 
 * <br>
 * <label for='select-name'>
 * Label select
 * </label>
 * <select
 *   class='select mb-3'
 *   [name]="'select-name'"
 * >
 *  <option value='' disabled>Select an option</option>
 *  <option value="1">Option 1</option>
 *  <option value="2">Option 2</option>
 * </select>
 * 
 * @example
 * <sq-select
 *   [name]="'select-name'"
 *   [label]="'Select an option'"
 *   [options]="selectOptions"
 *   [(value)]='value'
 *   (valueChange)="handleValueChange($event)"
 * >
 * </sq-select>
 */
@Component({
  selector: 'sq-select',
  templateUrl: './sq-select.component.html',
  styleUrls: ['./sq-select.component.scss']
})
export class SqSelectComponent {
  /**
   * The name attribute for the select input.
   * 
   * @default 'random-name-[hash-random-code]'
   */
  @Input() name = `random-name-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`

  /**
   * The selected value of the select input.
   */
  @Input() value?: any

  /**
   * The id attribute for the select input.
   */
  @Input() id?: string

  /**
   * The label for the select input.
   */
  @Input() label = ''

  /**
   * Custom CSS class for the select input.
   */
  @Input() customClass = ''

  /**
   * Placeholder text for the select input.
   */
  @Input() placeholder = ''

  /**
   * External error message for the select input.
   */
  @Input() externalError = ''

  /**
   * External icon for the select input.
   */
  @Input() externalIcon = ''

  /**
   * An array of options for populating the select input.
   */
  @Input() options: Option[] = []

  /**
   * Options with groups for populating the select input.
   */
  @Input() optionsWithGroups: Array<{
    label: string;
    options: Option[];
  }> = []

  /**
   * Indicates whether to display an error span.
   */
  @Input() errorSpan = true

  /**
   * Indicates whether the select input is disabled.
   */
  @Input() disabled = false

  /**
   * Indicates whether the select input is readonly.
   */
  @Input() readonly = false

  /**
   * Indicates whether the select input is required.
   */
  @Input() required = false

  /**
   * Indicates whether the select input is in a loading state.
   */
  @Input() loading = false

  /**
   * Indicates whether to use form errors for validation.
   */
  @Input() useFormErrors = true

  /**
   * Tooltip message for the select input.
   */
  @Input() tooltipMessage = ''

  /**
   * Tooltip placement for the select input.
   */
  @Input() tooltipPlacement: 'center top' | 'center bottom' | 'left center' | 'right center' = 'right center'

  /**
   * Tooltip color for the select input.
   */
  @Input() tooltipColor = 'inherit'

  /**
   * Tooltip icon for the select input.
   */
  @Input() tooltipIcon = ''

  /**
   * Background color for the select input.
   */
  @Input() backgroundColor = ''

  /**
   * Border color for the select input.
   */
  @Input() borderColor = ''

  /**
   * Label color for the select input.
   */
  @Input() labelColor = ''

  /**
   * Event emitted when the select input gains or loses focus.
   */
  @Output() inFocus: EventEmitter<boolean> = new EventEmitter()

  /**
   * Event emitted when the select input becomes valid or invalid.
   */
  @Output() valid: EventEmitter<boolean> = new EventEmitter()

  /**
   * Event emitted when the value of the select input changes.
   */
  @Output() valueChange: EventEmitter<any> = new EventEmitter()

  /**
   * Event emitter for focus input changes.
   */
  @Output() emitFocus: EventEmitter<Event> = new EventEmitter<Event>()

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
   * Reference to a right-aligned label template.
   */
  @ContentChild('labelTemplate')
  labelTemplate: TemplateRef<HTMLElement> | null = null

  /**
   * The error state of the select input.
   */
  error: boolean | string = false

  /**
   * ElementRef for the native select input element.
   */
  nativeElement: ElementRef

  /**
   * Constructs a new SqSelectComponent.
   *
   * @param {ElementRef} element - The ElementRef for the component.
   * @param {TranslateService} translate - The optional TranslateService for internationalization.
   */
  constructor(public element: ElementRef, @Optional() private translate: TranslateService) {
    this.nativeElement = element.nativeElement
  }

  /**
   * Validates the select input and sets the error state.
   *
   * @param {boolean} isBlur - Indicates whether the input is blurred.
   */
  validate(isBlur = false) {
    if (this.externalError) {
      this.error = false
    } else if (this.required && !this.value) {
      this.valid.emit(false)
      this.setError('forms.required')
    } else {
      this.valid.emit(true)
      this.error = ''
    }

    if (isBlur) {
      this.inFocus.emit(false)
    }
  }

  /**
   * Sets an error message.
   *
   * @param {string} key - The translation key for the error message.
   */
  async setError(key: string) {
    if (this.useFormErrors && this.translate) {
      this.error = await this.translate.instant(key)
    }
  }

  /**
   * Handles the change event of the select input.
   *
   * @param {any} value - The selected value.
   */
  change(value: any): void {
    this.inFocus.emit(true)
    this.value = value
    this.valueChange.emit(value)
    this.validate()
  }
}
