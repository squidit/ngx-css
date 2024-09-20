import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, Input, OnChanges, Optional, Output, TemplateRef, TrackByFunction } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { useMemo } from '../../helpers/memo.helper'
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
 * 
 * @implements {OnChanges}
 */
@Component({
  selector: 'sq-select-search',
  templateUrl: './sq-select-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
   * The label template for the search-based select input.
   */
  @ContentChild('labelTemplate')
  labelTemplate: TemplateRef<HTMLElement> | null = null

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
   * Minimum number of characters to perform the searchChange.
   */
  @Input() minCharactersToSearch = 0

  /**
   * The time interval for input timeout in ms.
   */
  @Input() timeToChange = 800

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
   * Native element reference.
   */
  nativeElement: ElementRef

  /**
   * Text entered in the search input field.
   */
  searchText = ''

  /**
   * Indicates when is the time to render the multi-tag select dropdown.
   */
  renderOptionsList = false

  /**
   * Indicates whether the dropdown is open.
   */
  open = false

  /**
   * Control options to render
   */
  _options: Array<Option> = []

  /**
   * Timeout for input changes.
   */
  timeoutInput!: ReturnType<typeof setTimeout>

  /**
   * Constructs a new SqSelectSearchComponent.
   *
   * @param {ElementRef} element - The element reference.
   * @param {TranslateService} translate - The optional TranslateService for internationalization.
   * @param {ChangeDetectorRef} changeDetector - Base class that provides change detection functionality.
   */
  constructor(public element: ElementRef, @Optional() private translate: TranslateService, private changeDetector: ChangeDetectorRef) {
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
   * Do action to open or close thw dropdown list
   */
  async doDropDownAction() {
    if (this.open) {
      this.closeDropdown()
      this.renderOptionsList = await new Promise<boolean>(resolve => setTimeout(() => {
        resolve(false)
      }, 300))
      this.changeDetector.detectChanges()
    } else {
      this._options = this.options
      this.renderOptionsList = true
      this.open = await new Promise<boolean>(resolve => setTimeout(() => {
        resolve(true)
      }, 100))
      this.changeDetector.detectChanges()
    }
  }

  /**
   * Closes the dropdown and resets the search text.
   */
  closeDropdown() {
    this.open = false
    this._options = []
    this.searchText = ''
  }

  /**
   * Return trackBy for ngFor
   */
  trackByOptValue: TrackByFunction<any> = useMemo((index, opt) => opt.value)

  /**
   * Handles changes to the search input value.
   *
   * @param {string} event - The search input value.
   */
  async onTipSearchChange(event: string) {
    if (!this.minCharactersToSearch || !event.length || event.length >= this.minCharactersToSearch) {
      clearTimeout(this.timeoutInput)
      this.searchText = await new Promise<string>(resolve => this.timeoutInput = setTimeout(() => {
        resolve(event)
      }, this.timeToChange)) || ''
      this.searchChange.emit(event)
      this.changeDetector.detectChanges()
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

}
