import { Component, ContentChild, ElementRef, EventEmitter, Input, Optional, Output, TemplateRef } from "@angular/core"
import { ValidatorHelper } from '../../helpers/validator.helper'
import { TranslateService } from "@ngx-translate/core"
import { SqInputComponent } from "../sq-input/sq-input.component"

/**
 * Represents an input component for handling numeric values.
 *
 * This component extends the {@link SqInputComponent} and adds additional properties and behavior for handling numeric input.
 * 
 * @example
 * <sq-input-number [(value)]='number' [name]="'number-input'" [id]="'number-input'"></sq-input-number>
 */
@Component({
  selector: 'sq-input-number',
  templateUrl: './sq-input-number.component.html',
  styleUrls: ['./sq-input-number.component.scss']
})
export class SqInputNumberComponent extends SqInputComponent {
  /**
   * The character used for thousand separators (e.g., ',' or '.').
   */
  @Input() thousandSeparator = '.'

  /**
   * Whether to display the input mask as the user types.
   */
  @Input() showMaskTyped = false

  /**
   * Whether to allow negative numbers.
   */
  @Input() allowNegativeNumbers = false

  /**
   * Whether to add a leading zero for single-digit numbers (e.g., '01' instead of '1').
   */
  @Input() leadZero = false

  /**
   * The character used as a placeholder for empty positions.
   */
  @Input() placeHolderCharacter = ''

  /**
   * The character used as a decimal marker (e.g., ',' or '.').
   */
  @Input() decimalMarker: "." | "," | [".", ","] = ','

  /**
   * Event emitter for changes in the numeric value.
   */
  @Output() override valueChange: EventEmitter<number> = new EventEmitter()

  /**
   * Content child template for the left label override.
   */
  @ContentChild('leftLabelOvewrite')
  leftLabelOvewrite: TemplateRef<HTMLElement> | null = null

  /**
   * Content child template for the right label override.
   */
  @ContentChild('rightLabelOvewrite')
  rightLabelOvewrite: TemplateRef<HTMLElement> | null = null

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
}
