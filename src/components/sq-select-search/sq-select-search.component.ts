import { Component, ElementRef, EventEmitter, Input, Optional, Output } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Option } from '../../interfaces/option.interface'

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
  styleUrls: ['./sq-select-search.component.scss'],
  providers: [],
})
export class SqSelectSearchComponent {
  /**
   * The name attribute for the search-based select input.
   */
  @Input() name = `random-name-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`
  /**
 * The selected value for the search-based select input.
 */
  @Input() value?: Option

  /**
   * The id attribute for the search-based select input.
   */
  @Input() id?: string

  /**
   * The label for the search-based select input.
   */
  @Input() label = ''

  /**
   * Custom CSS class for styling the component.
   */
  @Input() customClass = ''

  /**
   * Placeholder text for the input field.
   */
  @Input() placeholder = ''

  /**
   * External error message for the search-based select input.
   */
  @Input() externalError = ''

  /**
   * External icon for the search-based select input.
   */
  @Input() externalIcon = ''

  /**
   * Placeholder text for the search input field.
   */
  @Input() placeholderSearch = ''

  /**
   * Indicates whether the search-based select input is disabled.
   */
  @Input() disabled = false

  /**
   * Indicates whether the search-based select input is readonly.
   */
  @Input() readonly = false

  /**
   * Indicates whether the search-based select input is required.
   */
  @Input() required = false

  /**
   * Indicates whether the search-based select input is in a loading state.
   */
  @Input() loading = false

  /**
   * Indicates whether to use form errors for validation.
   */
  @Input() useFormErrors = true

  /**
   * Indicates whether to display an error span.
   */
  @Input() errorSpan = true

  /**
   * The time interval for input timeout in ms.
   */
  @Input() timeToChange = 0

  /**
   * Options available for selection.
   */
  @Input() options: Array<Option> = []

  /**
   * Background color for the search-based select input.
   */
  @Input() backgroundColor = ''

  /**
   * Border color for the search-based select input.
   */
  @Input() borderColor = ''

  /**
   * Color for the label of the search-based select input.
   */
  @Input() labelColor = ''

  /**
   * Tooltip message for the search-based select input.
   */
  @Input() tooltipMessage = ''

  /**
   * Tooltip placement for the search-based select input.
   */
  @Input() tooltipPlacement: 'center top' | 'center bottom' | 'left center' | 'right center' = 'right center'

  /**
   * Tooltip color for the search-based select input.
   */
  @Input() tooltipColor = 'inherit'

  /**
   * Tooltip icon for the search-based select input.
   */
  @Input() tooltipIcon = ''

  /**
   * Event emitted when the selected value changes.
   */
  @Output() valueChange: EventEmitter<Option> = new EventEmitter()

  /**
   * Event emitted when the search input value changes.
   */
  @Output() searchChange: EventEmitter<string> = new EventEmitter()

  /**
   * Event emitted when the search-based select input becomes valid or invalid.
   */
  @Output() valid: EventEmitter<boolean> = new EventEmitter()

  /**
   * Error message associated with the search-based select input.
   */
  error: boolean | string = ''

  /**
   * Timeout duration for input changes.
   */
  timeOutInputTime = 800

  /**
   * Native element reference.
   */
  nativeElement: ElementRef

  /**
   * Text entered in the search input field.
   */
  searchText = ''

  /**
   * Indicates whether the dropdown is open.
   */
  open = false

  /**
   * Constructs a new SqSelectSearchComponent.
   *
   * @param {ElementRef} element - The element reference.
   * @param {TranslateService} translate - The optional TranslateService for internationalization.
   */
  constructor(public element: ElementRef, @Optional() private translate: TranslateService) {
    this.nativeElement = element.nativeElement
  }

  /**
   * Emits the selected value and closes the dropdown.
   *
   * @param {any} event - The event containing the selected value.
   */
  emit(event: any) {
    this.value = event
    this.valueChange.emit(this.value)
    this.validate()
    this.closeDropdown()
  }

  /**
   * Validates the search-based select input and sets the error state.
   */
  validate() {
    if (this.externalError) {
      this.error = false
    } else if (this.required && !this.value) {
      this.setError('forms.required')
      this.valid.emit(false)
    } else {
      this.valid.emit(true)
      this.error = ''
    }
  }

  /**
   * Closes the dropdown and resets the search text.
   */
  closeDropdown() {
    this.open = false
    this.searchText = ''
  }

  /**
   * Handles changes to the search input value.
   *
   * @param {string} event - The search input value.
   */
  onTipSearchChange(event: string) {
    this.searchText = event
    this.searchChange.emit(event)
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
}
