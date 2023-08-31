import { Component, ContentChild, ElementRef, EventEmitter, Input, OnChanges, Optional, Output, SimpleChanges, TemplateRef } from "@angular/core"
import { ValidatorHelper } from '../../helpers/validator.helper'
import { TranslateService } from "@ngx-translate/core"
import { SqInputComponent } from "../sq-input/sq-input.component"

@Component({
  selector: 'sq-input-money',
  templateUrl: './sq-input-money.component.html',
  styleUrls: ['./sq-input-money.component.scss']
})
export class SqInputMoneyComponent extends SqInputComponent implements OnChanges {
  @Input() thousandSeparator = '.'
  @Input() showMaskTyped = false
  @Input() allowNegativeNumbers = false
  @Input() placeHolderCharacter = ''
  @Input() decimalMarker: "." | "," | [".", ","] = ","
  @Input() currency = 'BRL'

  @Output() override valueChange: EventEmitter<number> = new EventEmitter()

  override nativeElement: ElementRef
  prefix = this.getCurrencyPrefix()

  @ContentChild('rightLabelOvewrite')
  rightLabelOvewrite: TemplateRef<HTMLElement> | null = null

  constructor(
    public override validatorHelper: ValidatorHelper,
    element: ElementRef,
    @Optional() public override translate: TranslateService,
  ) {
    super(validatorHelper, element, translate)
    this.nativeElement = element.nativeElement
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["currency"] && changes["currency"].currentValue !== changes["currency"].previousValue && changes["currency"].currentValue) {
      this.prefix = this.getCurrencyPrefix()
    }
  }

  getCurrencyPrefix() {
    return Intl.NumberFormat(undefined, { style: 'currency', currency: this.currency, }).format(0).replace(/\d/g, '').replace('.', '').replace(',', '')
  }
}
