import {
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

/**
 * Represents a selector input component for checkboxes or radio buttons.
 *
 * Look the link about the component in original framework and the appearance
 *
 * @see {@link https://css.squidit.com.br/forms/selectors}
 * 
 * <br />
 * <div class='row'>
 *  <div class='col-md-4'>
 *    <div class='wrapper-selectors mb-3'>
 *      <input
 *        type='checkbox'
 *        name='checkbox'
 *        id='checkbox'
 *      />
 *      <label
 *        class='checkbox'
 *        for='checkbox'
 *      ></label>
 *      <label
 *        for='checkbox'
 *      >
 *        Label
 *      </label>
 *    </div>
 *  </div>
 *  <div class='col-md-4'>
 *    <div class='wrapper-selectors mb-3'>
 *      <input
 *        type='radio'
 *        name='radio'
 *        id='radio'
 *      />
 *      <label
 *        class='checkbox'
 *        for='radio'
 *      ></label>
 *      <label
 *        for='radio'
 *      >
 *        Label
 *      </label>
 *    </div>
 *  </div>
 *  <div class='col-md-4'>
 *    <div class='wrapper-selectors toggle mb-3'>
 *      <input
 *        type='checkbox'
 *        name='toggle'
 *        id='toggle'
 *      />
 *      <label
 *        class='checkbox'
 *        for='toggle'
 *      ></label>
 *      <label
 *        for='toggle'
 *      >
 *        Label
 *      </label>
 *    </div>
 *  </div>
 *</div>
 * 
 * @example
 * <sq-selector
 *   [label]="'Check this box'"
 *   [checked]="isChecked"
 *   [value]="selectedValue"
 *   (valueChange)="handleValueChange($event)"
 * ></sq-selector>
 */
@Component({
  selector: 'sq-selector',
  templateUrl: './sq-selector.component.html',
  styleUrls: ['./sq-selector.component.scss'],
})
export class SqSelectorComponent implements OnChanges {
  /**
   * The name attribute for the selector input.
   */
  @Input() name = ''

  /**
   * The type of selector: 'checkbox' or 'radio'.
   */
  @Input() type: 'checkbox' | 'radio' = 'checkbox'

  /**
   * The id attribute for the selector input.
   */
  @Input() id?: string

  /**
   * The selected value of the selector input.
   */
  @Input() value: any = ''

  /**
   * Indicates whether the selector input is checked.
   */
  @Input() checked = false

  /**
   * Indicates whether the selector input is in an indeterminate state.
   */
  @Input() indeterminate = false

  /**
   * Indicates whether the selector input is disabled.
   */
  @Input() disabled?: boolean

  /**
   * Indicates whether the selector input is readonly.
   */
  @Input() readonly?: boolean

  /**
   * Indicates whether the selector input is required.
   */
  @Input() required?: boolean

  /**
   * Text color for the selector input.
   */
  @Input() colorText = ''

  /**
   * Background color for the selector input when checked.
   */
  @Input() colorBackground = 'green'

  /**
   * Indicates whether to hide the actual input element.
   */
  @Input() hideInput = false

  /**
   * Indicates whether the selector input supports toggle behavior.
   */
  @Input() toggle = false

  /**
   * External error message for the selector input.
   */
  @Input() externalError = ''

  /**
   * Indicates whether to use form errors for validation.
   */
  @Input() useFormErrors = true

  /**
   * The label for the selector input.
   */
  @Input() label = ''

  /**
   * Indicates whether to display an error span.
   */
  @Input() errorSpan = true

  /**
   * Block (width: 100%) the selector input.
   */
  @Input() block = false

  /**
   * fitContent (width: 'fit-content') the selector input.
   */
  @HostBinding('class.fitContent') @Input() fitContent = true

  /**
   * Event emitted when the value of the selector input changes.
   */
  @Output() valueChange: EventEmitter<{
    value: any;
    checked: boolean;
  }> = new EventEmitter()

  /**
   * Event emitted when the selector input becomes valid or invalid.
   */
  @Output() valid: EventEmitter<boolean> = new EventEmitter()

  /**
   * Content child for the right label template.
   */
  @ContentChild('rightLabel')
  rightLabel: TemplateRef<HTMLElement> | null = null

  /**
   * Content child for the left label template.
   */
  @ContentChild('leftLabel')
  leftLabel: TemplateRef<HTMLElement> | null = null

  /**
   * Indicates whether the selector input is currently checked.
   */
  thisChecked = false

  /**
   * Indicates whether the selector input is in an indeterminate state.
   */
  thisIndeterminate = false

  /**
   * Error message associated with the selector input.
   */
  error = ''

  /**
   * Context object containing selector properties.
   */
  context: any = {
    checked: this.thisChecked,
    indeterminate: !this.thisChecked ? this.thisIndeterminate : false,
    value: this.value
  }

  /**
   * Constructs a new SqSelectorComponent.
   *
   * @param {TranslateService} translate - The optional TranslateService for internationalization.
   */
  constructor(
    @Optional() public translate: TranslateService
  ) { }

  /**
   * Lifecycle hook called when any input properties change.
   *
   * @param {SimpleChanges} changes - An object containing changed input properties.
   */
  async ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('checked')) {
      this.thisChecked = this.checked
      this.context.checked = this.thisChecked
    }
    if (changes.hasOwnProperty('indeterminate')) {
      this.thisIndeterminate = this.indeterminate
      this.context.indeterminate = !this.thisChecked ? this.thisIndeterminate : false
    }
    if (changes.hasOwnProperty('value')) {
      this.context.value = this.value
    }
  }

  /**
   * Validates the selector input and sets the error state.
   */
  async validate() {
    if (this.externalError) {
      this.error = ''
    } else if (this.required && !this.thisChecked) {
      this.valid.emit(false)
      this.error = await this.translate.instant('forms.required')
    } else {
      this.valid.emit(true)
      this.error = ''
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
   * Handles the change event of the selector input.
   *
   * @param {any} event - The change event object.
   */
  change(event: any): void {
    if (!this.readonly && !this.disabled) {
      this.valueChange.emit({
        value: this.value,
        checked: event?.target?.checked,
      })
      this.thisChecked = event?.target?.checked
    }
    this.validate()
  }
}
