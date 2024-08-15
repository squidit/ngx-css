import { Component, ContentChild, ElementRef, EventEmitter, Input, OnChanges, Optional, Output, SimpleChanges, TemplateRef } from "@angular/core"
import { ValidatorHelper } from '../../helpers/validator.helper'
import { TranslateService } from "@ngx-translate/core"
import { SqInputComponent } from "../sq-input/sq-input.component"

/**
 * Represents an input component for handling money values.
 *
 * @implements {OnChanges}
 *
 * This component uses ngx-mask library
 * @see {@link https://github.com/JsDaddy/ngx-mask}
 *
 * This component extends the {@link SqInputComponent} and adds additional properties and behavior for handling money input.
 *
 * @example
 * <sq-input-money [(value)]='payment' [name]="'money-input'" [id]="'money-input'" [label]="'Money Input'" currency='USD'></sq-input-money>
 */
@Component({
  selector: 'sq-input-money',
  templateUrl: './sq-input-money.component.html',
  styleUrls: ['./sq-input-money.component.scss']
})
export class SqInputMoneyComponent extends SqInputComponent implements OnChanges {
  /**
   * The value of the input element.
   */
  @Input()
  public override set value(value: any) {
    if (typeof value === 'number') {
      this._value = value.toString()
    } else {
      this._value = value || ''
    }
  }
  public override get value(): any {
    return parseFloat(this._value)
  }

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
   * The character used as a placeholder for empty positions.
   */
  @Input() placeHolderCharacter = ''

  /**
   * The character used as a decimal marker (e.g., ',' or '.').
   */
  @Input() decimalMarker: "." | "," | [".", ","] = ","

  /**
   * The currency symbol (e.g., 'USD', 'EUR', 'BRL').
   */
  @Input() currency = 'BRL'

  /**
   * Event emitter for changes in the money value.
   */
  @Output() override valueChange: EventEmitter<number> = new EventEmitter()

  /**
   * Event emitter for focus input changes.
   */
  @Output() override onFocus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>()

  /**
   * Reference to the native element.
   */
  override nativeElement: ElementRef

  /**
   * The currency prefix based on the current currency.
   */
  prefix = this.getCurrencyPrefix()

  /**
   * Content child template for the right label override.
   */
  @ContentChild('rightLabelOverwrite')
  rightLabelOverwrite: TemplateRef<HTMLElement> | null = null

  /**
   * Reference to a label template.
   */
  @ContentChild('labelTemplate')
  labelTemplateOverwrite: TemplateRef<HTMLElement> | null = null

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
   * Lifecycle hook that is called when input property values change.
   * @param changes - An object containing changed properties and their previous and current values.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes["currency"] && changes["currency"].currentValue !== changes["currency"].previousValue && changes["currency"].currentValue) {
      this.prefix = this.getCurrencyPrefix()
    }
  }

  /**
   * Get the currency prefix based on the current currency.
   * @returns The currency prefix as a string.
   */
  getCurrencyPrefix() {
    return Intl.NumberFormat(undefined, { style: 'currency', currency: this.currency, }).format(0).replace(/\d/g, '').replace('.', '').replace(',', '')
  }
}
