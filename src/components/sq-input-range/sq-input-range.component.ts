import { AfterContentInit, Component, ContentChild, ElementRef, EventEmitter, Input, OnChanges, Optional, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ValidatorHelper } from '../../helpers/validator.helper'
import { sleep } from '../../helpers/sleep.helper'

/**
 * Represents an input component for selecting a numeric value within a specified range.
 *
 * This component allows users to input a numeric value within a defined range and provides visual feedback for the selected value.
 * 
 * @implements {AfterContentInit}
 * @implements {OnChanges}
 * 
 * <br>
 * <label for='id-exemple-range'>
 *  Example Input Range
 * </label>
 * <input
 *   class='range mb-3'
 *   name="name-exemple-range"
 *   id="id-exemple-range"
 *   type="range"
 * ></input>
 * 
 * @example
 * <sq-input-range [name]='"input-range"' [(value)]='number' ></sq-input-range>
 */
@Component({
  selector: 'sq-input-range',
  templateUrl: './sq-input-range.component.html',
  styleUrls: ['./sq-input-range.component.scss']
})
export class SqInputRangeComponent implements AfterContentInit, OnChanges {
  /**
   * A custom CSS class to apply to the input element.
   */
  @Input() customClass = ''

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
   * The initial value of the input.
   */
  @Input() value: any = '0'

  /**
   * Whether the input is read-only.
   */
  @Input() readonly = false

  /**
   * Whether the input is required.
   */
  @Input() required = false

  /**
   * The label to display for the input.
   */
  @Input() label = ''

  /**
   * The color of the input component.
   */
  @Input() color = 'var(--primary_color)'

  /**
   * The color of the input label.
   */
  @Input() labelColor = ''

  /**
   * Whether to display an error message below the input.
   */
  @Input() errorSpan = true

  /**
   * An external error message, if provided.
   */
  @Input() externalError?: any

  /**
   * The step value for the input.
   */
  @Input() step = 1

  /**
   * The minimum allowed value for the input.
   */
  @Input() minNumber = 0

  /**
   * The maximum allowed value for the input.
   */
  @Input() maxNumber = 100

  /**
   * Whether to use form-level error messages.
   */
  @Input() useFormErrors = true

  /**
   * Event emitter for changes in the input value.
   */
  @Output() valueChange: EventEmitter<any> = new EventEmitter()

  /**
   * Event emitter for focusing or blurring the input.
   */
  @Output() inFocus: EventEmitter<boolean> = new EventEmitter()

  /**
   * Event emitter for indicating the validity of the input.
   */
  @Output() valid: EventEmitter<boolean> = new EventEmitter()

  /**
   * Event emitter for focus input changes.
   */
  @Output() onFocus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>()

  /**
   * Event emitter for focus input changes.
   */
  @Output() onBlur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>()

  /**
   * A reference to the 'valueFloating' element in the component template.
   */
  @ViewChild('valueFloating') valueFloating!: ElementRef

  /**
   * A reference to the 'input' element in the component template.
   */
  @ViewChild('input') input!: ElementRef

  /**
   * Reference to a label template.
   */
  @ContentChild('labelTemplate')
  labelTemplate: TemplateRef<HTMLElement> | null = null


  /**
   * The error message associated with the input.
   */
  error: boolean | string = false

  /**
   * A reference to the native element of the component.
   */
  nativeElement: ElementRef

  /**
   * Creates an instance of `SqInputRangeComponent`.
   *
   * @param validatorHelper - An instance of the `ValidatorHelper` service.
   * @param element - A reference to the element hosting the component.
   * @param translate - An optional instance of the `TranslateService` for internationalization.
   */
  constructor(
    public validatorHelper: ValidatorHelper,
    element: ElementRef,
    @Optional() public translate: TranslateService,
  ) {
    this.nativeElement = element.nativeElement
  }

  /**
   * Lifecycle hook that runs after content initialization.
   * It sets a timeout to change the value position.
   */
  async ngAfterContentInit() {
    await sleep()
    this.changeValuePosition()
  }

  /**
   * Lifecycle hook that runs when changes occur in the component's input properties.
   * It recalculates the value position when value-related properties change.
   *
   * @param changes - An object containing changes to input properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('value') || changes.hasOwnProperty('minNumber') || changes.hasOwnProperty('maxNumber')) {
      this.changeValuePosition()
    }
  }

  /**
   * Validates the input value.
   *
   * @param isBlur - Indicates whether the validation is triggered by blurring the input.
   */
  validate(isBlur = false) {
    if (this.externalError) {
      this.error = false
    } else if (!!this.required && !this.value && this.value !== '0') {
      this.setError('forms.required')
      this.valid.emit(false)
    } else {
      this.valid.emit(true)
      this.error = ''
    }
    if (isBlur) {
      this.inFocus.emit(false)
    }
  }

  /**
   * Changes the visual position of the input value based on the current value,
   * minimum and maximum allowed values.
   */
  changeValuePosition() {
    const val = parseFloat(this.value)
    const min = this.minNumber ? this.minNumber : 0
    const max = this.maxNumber ? this.maxNumber : 100
    const newVal = Number(((val - min) * 100) / (max - min))
    if (this.valueFloating) {
      this.valueFloating.nativeElement.style.left = `calc(${newVal}% + (${10 - newVal * 0.36}px))`
    }
  }

  /**
   * Handle input value changes.
   * @param event - The input change event.
   */
  change(event: any): void {
    this.inFocus.emit(true)
    this.changeValuePosition()
    this.value = event
    this.valueChange.emit(event)
    this.validate()
  }

  /**
   * Set an error message based on a translation key.
   * @param key - The translation key for the error message.
   */
  async setError(key: string) {
    if (this.useFormErrors && this.translate) {
      this.error = await this.translate.instant(key)
    }
  }
}
