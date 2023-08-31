import { Component, ContentChild, ElementRef, EventEmitter, Input, Optional, Output, TemplateRef } from "@angular/core"
import { ValidatorHelper } from '../../helpers/validator.helper'
import { TranslateService } from "@ngx-translate/core"
import { SqInputComponent } from "../sq-input/sq-input.component"

@Component({
  selector: 'sq-input-number',
  templateUrl: './sq-input-number.component.html',
  styleUrls: ['./sq-input-number.component.scss']
})
export class SqInputNumberComponent extends SqInputComponent {
  @Input() thousandSeparator = '.'
  @Input() showMaskTyped = false
  @Input() allowNegativeNumbers = false
  @Input() leadZero = false
  @Input() placeHolderCharacter = ''
  @Input() decimalMarker: "." | "," | [".", ","] = ','

  @Output() override valueChange: EventEmitter<number> = new EventEmitter()

  @ContentChild('leftLabelOvewrite')
  leftLabelOvewrite: TemplateRef<HTMLElement> | null = null
  @ContentChild('rightLabelOvewrite')
  rightLabelOvewrite: TemplateRef<HTMLElement> | null = null

  override nativeElement: ElementRef

  constructor(
    public override validatorHelper: ValidatorHelper,
    element: ElementRef,
    @Optional() public override translate: TranslateService,
  ) {
    super(validatorHelper, element, translate)
    this.nativeElement = element.nativeElement
  }
}
