import { Component, ContentChild, ElementRef, Input, Optional, TemplateRef } from "@angular/core"
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
   * Defines the minimum value that can be accepted as input.
   */
  @Input() minValue?: number

  /**
   * Defines the maximum value that can be accepted as input.
   */
  @Input() maxValue?: number

  /**
   * Reference to a label template.
   */
  @ContentChild('labelTemplate')
  override labelTemplate: TemplateRef<HTMLElement> | null = null

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
   * Asynchronously validate the date input value.
   * @param isBlur - Indicates if the input has lost focus.
   */
  override async validate(isBlur = false) {
    const numericValue = Number(this.value)

    if (this.externalError) {
      this.error = false
    } else if (this.required && (this.value === null || this.value === undefined || this.value === '')) {
      this.valid.emit(false)
      this.setError('forms.required')
    } else if (this.maxValue && numericValue > this.maxValue) {
      this.valid.emit(false)
      this.setError('forms.maxValueAllowed', { max: this.maxValue })
    } else if (this.minValue && numericValue < this.minValue) {
      this.valid.emit(false)
      this.setError('forms.minValueAllowed', { min: this.minValue })
    } else {
      this.valid.emit(true)
      this.error = ''
    }

    if (isBlur) {
      this.inFocus.emit(false)
    }
  }
}
