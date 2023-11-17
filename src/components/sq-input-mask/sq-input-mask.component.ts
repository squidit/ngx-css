import { Component, ElementRef, Input, Optional } from "@angular/core"
import { ValidatorHelper } from '../../helpers/validator.helper'
import { TranslateService } from "@ngx-translate/core"
import { SqInputComponent } from "../sq-input/sq-input.component"

/**
 * Represents an input field with mask functionality that extends SqInputComponent.
 *
 * This component uses ngx-mask library
 * @see {@link https://github.com/JsDaddy/ngx-mask}
 *
 * This component extends the {@link SqInputComponent} and adds additional properties and behavior for handling money input.
 *
 * @example
 * <sq-input-mask [(value)]='phone' [name]="'masked-input'" [id]="'masked-input'" [label]="'Masked Input'" [mask]="'(999) 999-9999'"></sq-input-mask>
 */
@Component({
  selector: 'sq-input-mask',
  templateUrl: './sq-input-mask.component.html',
  styleUrls: ['./sq-input-mask.component.scss']
})
export class SqInputMaskComponent extends SqInputComponent {
  /**
   * The mask pattern for input validation and formatting.
   */
  @Input() mask = ''

  /**
   * The character used as a thousand separator in numeric input.
   */
  @Input() thousandSeparator = ''

  /**
   * The suffix to be appended to the input value.
   */
  @Input() suffix = ''

  /**
   * The prefix to be prepended to the input value.
   */
  @Input() prefix = ''

  /**
   * Indicates whether the mask should be visible while typing.
   */
  @Input() showMaskTyped = false

  /**
   * Indicates whether negative numbers are allowed.
   */
  @Input() allowNegativeNumbers = false

  /**
   * The decimal marker character or an array of characters to represent decimal values.
   */
  @Input() decimalMarker: "." | "," | [".", ","] = [".", ","]

  /**
   * The character to use as a placeholder in empty mask slots.
   */
  @Input() placeHolderCharacter = ''

  /**
   * Indicates whether leading zeros should be preserved.
   */
  @Input() leadZero = false

  /**
   * The character used as a placeholder for empty positions.
   */
  @Input() minValue?: number

  /**
   * The character used as a placeholder for empty positions.
   */
  @Input() maxValue?: number

  /**
   * Reference to the native element.
   */
  override nativeElement: ElementRef

  /**
   * Constructs a new instance of SqInputMaskComponent.
   * @param validatorHelper - The ValidatorHelper service for input validation.
   * @param element - Reference to the native element.
   * @param translate - The TranslateService for translation support (optional).
   */
  constructor(
    public override validatorHelper: ValidatorHelper,
    element: ElementRef,
    @Optional() public override translate: TranslateService,
  ) {
    super(validatorHelper, element, translate)
    this.nativeElement = element.nativeElement
  }

  /**
   * Sets an error message.
   *
   * @param {string} key - The translation key for the error message.
   * @param interpolateParams - Value to interpolate with translation.
   */
  override async setError(key: string, interpolateParams: Object = {}) {
    if (this.useFormErrors && this.translate) {
      this.error = await this.translate.instant(key, interpolateParams)
    }
  }

  /**
   * Handle input value changes.
   * @param event - The input change event.
   */
  override async change(event: any) {
    this.inFocus.emit(true)
    this.value = event
    clearTimeout(this.timeoutInput)
    this.timeoutInput = setTimeout(() => {
      this.valueChange.emit(event)
    }, this.timeToChange)
    this.validate()
  }

  /**
   * Asynchronously validate the date input value.
   * @param isBlur - Indicates if the input has lost focus.
   */
  override async validate(isBlur = false) {
    const numericValue = Number(this.value); // Convert string to number

    if (this.externalError) {
      this.error = false
    } else if (this.required && !this.value) {
      this.valid.emit(false)
      this.setError('forms.required')
    } else if (this.maxValue && numericValue > this.maxValue) {
      this.valid.emit(false)
      this.setError('forms.maxValue', {minValue: this.maxValue})
    } else if (this.minValue && numericValue < this.minValue) {
      this.valid.emit(false)
      this.setError('forms.minValue', {minValue: this.minValue})
    } else {
      this.valid.emit(true)
      this.error = ''
    }
  }
}
