import { Component, ElementRef, Input, Optional } from "@angular/core"
import { ValidatorHelper } from '../../helpers/validator.helper'
import { TranslateService } from "@ngx-translate/core"
import { SqInputComponent } from "../sq-input/sq-input.component"

@Component({
  selector: 'sq-input-mask',
  templateUrl: './sq-input-mask.component.html',
  styleUrls: ['./sq-input-mask.component.scss']
})
export class SqInputMaskComponent extends SqInputComponent {
  @Input() mask = ''
  @Input() thousandSeparator = ''
  @Input() suffix = ''
  @Input() prefix = ''
  @Input() showMaskTyped = false
  @Input() allowNegativeNumbers = false
  @Input() decimalMarker: "." | "," | [".", ","] = [".", ","]
  @Input() placeHolderCharacter = ''
  @Input() leadZero = false

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