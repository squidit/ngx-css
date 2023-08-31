import { Component, ContentChild, ElementRef, Input, Optional, TemplateRef } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ValidatorHelper } from '../../helpers/validator.helper'
import { SqInputComponent } from '../sq-input/sq-input.component'

@Component({
  selector: 'sq-input-file',
  templateUrl: './sq-input-file.component.html',
  styleUrls: ['./sq-input-file.component.scss']
})
export class SqInputFileComponent extends SqInputComponent {
  @Input() textColor = 'var(--white-html)'
  @Input() override borderColor = 'var(--pink)'
  @Input() color = 'var(--pink)'
  @Input() fontSize = '1rem'
  @Input() maxSize?: number
  @Input() loading = false
  @Input() fileType = '*.*'
  @Input() multiple = false
  @Input() noPadding = false

  @ContentChild('customContent', { static: true })
  customContent: TemplateRef<HTMLElement> | null = null

  override error: boolean | string = false
  override timeoutInput!: ReturnType<typeof setTimeout>
  override timeStamp = `random-id-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`
  override nativeElement: ElementRef

  constructor(
    public override validatorHelper: ValidatorHelper,
    element: ElementRef,
    @Optional() public override translate: TranslateService,
  ) {
    super(validatorHelper, element, translate)
    this.nativeElement = element.nativeElement
  }

  override async validate(isBlur = false) {
    if (this.externalError) {
      this.error = false
    } else if (!!this.required && (!this.value || this.value.length < 1) && this.value !== 0) {
      this.setError('formErrors.required')
      this.valid.emit(false)
    } else if (this.maxSize && this.value && this.value.length > 0) {
      let bigFiles = 0
      for (const file of this.value) {
        if (file.size > this.maxSize) {
          bigFiles++
        }
      }
      if (bigFiles > 0) {
        this.setError('formErrors.fileSize')
        this.valid.emit(false)
      } else {
        this.valid.emit(true)
        this.error = ''
      }
    } else {
      this.valid.emit(true)
      this.error = ''
    }
    if (isBlur) {
      this.inFocus.emit(false)
    }
  }

  override change(event: any): void {
    this.value = event.target?.files || event
    this.valueChange.emit(this.value)
    this.validate()
  }
}
