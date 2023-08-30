import { Component, ContentChild, ElementRef, EventEmitter, Input, Optional, Output, TemplateRef } from '@angular/core'
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

  @Output() sharedFileValid = new EventEmitter()

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
      this.sharedValid.emit(false)
    } else if (this.maxSize && this.value && this.value.length > 0) {
      let bigFiles = 0
      for (const file of this.value) {
        if (file.size > this.maxSize) {
          bigFiles++
        }
      }
      if (bigFiles > 0) {
        this.setError('formErrors.fileSize')
        this.sharedFileValid.emit(false)
      } else {
        this.sharedFileValid.emit(true)
        this.error = ''
      }
    } else {
      this.sharedFileValid.emit(true)
      this.sharedValid.emit(true)
      this.error = ''
    }
    if (isBlur) {
      this.sharedFocus.emit(false)
    }
  }

  override change(event: any): void {
    this.value = event.target?.files || event
    this.sharedValue.emit(this.value)
    this.validate()
  }
}
