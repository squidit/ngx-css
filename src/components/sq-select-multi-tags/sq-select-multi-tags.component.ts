import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Optional, Output, TrackByFunction } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { OptionMulti } from '../../interfaces/option.interface'
import { useMemo } from '../../helpers/memo.helper'

/**
 * Represents a multi-tag select component.
 *
 * @example
 * <sq-select-multi-tags
 *   [name]="'tags'"
 *   [value]="selectedTags"
 *   [options]="tagOptions"
 *   (valueChange)="handleTagSelection($event)"
 * >
 * </sq-select-multi-tags>
 */
@Component({
  selector: 'sq-select-multi-tags',
  templateUrl: './sq-select-multi-tags.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./sq-select-multi-tags.component.scss'],
  providers: [],
})
export class SqSelectMultiTagsComponent {
  /**
   * The name attribute for the multi-tag select input.
   * 
   * @default 'random-name-[hash-random-code]'
   */
  @Input() name = `random-name-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`

  /**
   * The selected values for the multi-tag select input.
   */
  @Input() value?: OptionMulti[] = []

  /**
   * The id attribute for the multi-tag select input.
   */
  @Input() id?: string

  /**
   * The label for the multi-tag select input.
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
   * External error message for the multi-tag select input.
   */
  @Input() externalError = ''

  /**
   * External icon for the multi-tag select input.
   */
  @Input() externalIcon = ''

  /**
   * Placeholder text for the search input field.
   */
  @Input() placeholderSearch = ''

  /**
   * Indicates whether the multi-tag select input is disabled.
   */
  @Input() disabled = false

  /**
   * Indicates whether the multi-tag select input is readonly.
   */
  @Input() readonly = false

  /**
   * Indicates whether the multi-tag select input is required.
   */
  @Input() required = false

  /**
   * Indicates whether the multi-tag select input is in a loading state.
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
   * Background color for the multi-tag select input.
   */
  @Input() backgroundColor = ''

  /**
   * Border color for the multi-tag select input.
   */
  @Input() borderColor = ''

  /**
   * Color for the label of the multi-tag select input.
   */
  @Input() labelColor = ''

  /**
   * Options available for selection.
   */
  @Input() options: Array<OptionMulti> = []

  /**
   * Indicates whether to show selected tags inside the input.
   */
  @Input() showInside = true

  /**
   * Indicates whether to hide the search input.
   */
  @Input() hideSearch = false

  /**
   * Tooltip message for the multi-tag select input.
   */
  @Input() tooltipMessage = ''

  /**
   * Tooltip placement for the multi-tag select input.
   */
  @Input() tooltipPlacement: 'center top' | 'center bottom' | 'left center' | 'right center' = 'right center'

  /**
   * Tooltip color for the multi-tag select input.
   */
  @Input() tooltipColor = 'inherit'

  /**
   * Tooltip icon for the multi-tag select input.
   */
  @Input() tooltipIcon = ''

  /**
   * Event emitted when the selected values change.
   */
  @Output() valueChange: EventEmitter<Array<OptionMulti>> = new EventEmitter()

  /**
   * Event emitted when the multi-tag select dropdown is closed.
   */
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter()

  /**
   * Event emitted when a tag is removed.
   */
  @Output() removeTag: EventEmitter<OptionMulti> = new EventEmitter()

  /**
   * Event emitted when the multi-tag select input becomes valid or invalid.
   */
  @Output() valid: EventEmitter<boolean> = new EventEmitter()


  /**
   * Indicates when is the time to render the multi-tag select dropdown.
   */
  renderOptionsList = false

  /**
   * Indicates whether the multi-tag select dropdown is open.
   */
  open = false

  /**
   * Text entered in the search input field.
   */
  searchText = ''

  /**
   * Indicates whether the value has changed.
   */
  valueChanged = false

  /**
   * Indicates whether a timeout has occurred for input changes.
   */
  timeouted = false

  /**
   * Error message associated with the multi-tag select input.
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
   * Timeout for input changes.
   */
  timeoutInput!: ReturnType<typeof setTimeout>

  /**
   * Time in milliseconds before triggering input timeout.
   */
  timeToChange = 800

  /**
   * Control pagination for options
   */
  _options: Array<OptionMulti> = []

  /**
   * Indicate if has more options to add on _options
   */
  hasMoreOptions = true

  /**
   * Loading for sq-infinity-scroll
   */
  loadingScroll = false

  /**
   * Control quantity for limit and to addMore on _options
   */
  quantity = 15

  /**
   * Control the _options limit
   */
  limit = this.quantity

  /**
   * Constructs a new SqSelectMultiTagsComponent.
   *
   * @param {ElementRef} element - The element reference.
   * @param {TranslateService} translate - The optional TranslateService for internationalization.
   * @param {ChangeDetectorRef} changeDetector - Base class that provides change detection functionality.
   */
  constructor(public element: ElementRef, @Optional() private translate: TranslateService, private changeDetector: ChangeDetectorRef) {
    this.nativeElement = element.nativeElement
  }

  /**
   * Determines if an item exists in the selected values.
   *
   * @param {OptionMulti} item - The item to search for.
   * @returns {boolean} True if the item exists in the selected values; otherwise, false.
   */
  findItemInValue = useMemo((item: OptionMulti) => {
    return !!this.value?.find((value) => value.value === item.value)
  })

  /**
   * Verifies if any options have children.
   *
   * @param {OptionMulti[]} options - The options to check.
   * @returns {boolean} True if any option has children; otherwise, false.
   */
  verifyIfOptionsHasChildren = useMemo((options: OptionMulti[]) => {
    return options.some((item) => item.children?.length)
  })

  /**
   * Verifies if an item has children that are selected.
   *
   * @param {OptionMulti} item - The item to check.
   * @returns {boolean} True if the item has selected children; otherwise, false.
   */
  verifyIfHasChildrenInValue = useMemo((item: OptionMulti) => {
    if (item.children?.length) {
      const hasAllChildren = item.children.every((child) => this.findItemInValue(child))
      if (hasAllChildren && !this.findItemInValue(item) && !this.timeouted) {
        this.timeouted = true
        setTimeout(() => {
          this.emit(item, true)
          this.timeouted = false
        }, 0)
      }
      return !!item.children.find((child) => this.findItemInValue(child))
    }
    return false
  })

  /**
   * Removes an item from the selected values.
   *
   * @param {OptionMulti} item - The item to remove.
   */
  removeItem(item: OptionMulti) {
    if (item.children?.length) {
      item.children.forEach((child) => {
        this.value = this.value?.filter((value) => value.value !== child.value)
      })
    }
    this.value = this.value?.filter((value) => value.value !== item.value)

    this.valueChange.emit(this.value)
    this.removeTag.emit(item)
    this.validate()
  }

  /**
   * Emits a change event with the specified object and checked state.
   *
   * @param {OptionMulti} object - The object to emit.
   * @param {boolean} checked - The checked state.
   */
  emit(object: OptionMulti, checked: boolean) {
    if (checked) {
      this.value?.push(object)
      // This code adds all children of a parent to value. Commented out for now as it is not the desired behavior.
      // if (object.children?.length) {
      //   object.children.forEach((item) => {
      //     if (!this.value.find((child) => child.value === item.value)) {
      //       this.value.push(item)
      //     }
      //   })
      // }
    } else {
      this.value = this.value?.filter((item) => item.value !== object.value)
      if (object.children?.length) {
        object.children.forEach((item) => {
          this.value = this.value?.filter((child) => child.value !== item.value)
        })
      }
    }
    this.valueChanged = true
    this.valueChange.emit(this.value)
    this.validate()
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
      this.addMoreOptions()
      this.renderOptionsList = true
      this.open = await new Promise<boolean>(resolve => setTimeout(() => {
        resolve(true)
      }, 100))
      this.changeDetector.detectChanges()
    }
  }

  /**
   * Closes the multi-tag select dropdown.
   */
  closeDropdown() {
    this.open = false
    this._options = []
    this.limit = this.quantity
    this.hasMoreOptions = true
    this.searchText = ''
    this.closeChange.emit(this.valueChanged)
    this.valueChanged = false
  }

  /**
   * Handles the collapse of an item.
   *
   * @param {OptionMulti} item - The item to collapse.
   */
  async handleCollapse(item: OptionMulti) {
    item.open = !item.open
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
   * Validates the multi-tag select input and sets the error state.
   */
  validate() {
    if (this.externalError) {
      this.error = false
    } else if (this.required && !this.value?.length) {
      this.setError('forms.required')
      this.valid.emit(false)
    } else {
      this.valid.emit(true)
      this.error = ''
    }
  }

  /**
   * Return trackBy for ngFor
   */
  trackByOptValue: TrackByFunction<any> = useMemo((index, opt) => opt.value)

  /**
   * Change searchtext with timeout and detect detectChanges
   */
  async modelChange(event: any) {
    clearTimeout(this.timeoutInput)
    this.searchText = await new Promise<string>(resolve => this.timeoutInput = setTimeout(() => {
      resolve(event)
    }, this.timeToChange)) || ''
    this.changeDetector.detectChanges()
  }

  /**
   * Function to add more values on _options
   */
  addMoreOptions() {
    if (this.hasMoreOptions) {
      this.loadingScroll = true
      const limitState = this.limit > this.options.length ? this.options.length : this.limit
      this._options = this.options.slice(0, limitState)
      this.limit = this.limit + this.quantity
      this.hasMoreOptions = limitState !== this.options.length
      this.loadingScroll = false
    }
  }
}
