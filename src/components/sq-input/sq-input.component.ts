import { Component, ContentChild, ElementRef, EventEmitter, Input, Optional, Output, TemplateRef } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ValidatorHelper } from '../../helpers/validator.helper'

@Component({
  selector: 'sq-input',
  templateUrl: './sq-input.component.html',
  styleUrls: ['./sq-input.component.scss']
})
export class SqInputComponent {
  @Input() name = ''
  @Input() id = ''
  @Input() label?: string
  @Input() customClass = ''
  @Input() placeholder = ''
  @Input() externalError = ''
  @Input() externalIcon = ''
  @Input() value: any = ''

  @Input() timeOutInputTime = 800
  @Input() hasTimeout = false
  @Input() errorSpan = true
  @Input() disabled = false
  @Input() readonly = false
  @Input() required = false
  @Input() useFormErrors = true

  @Input() tooltipMessage = ''
  @Input() tooltipPlacement: 'center top' | 'center bottom' | 'left center' | 'right center' = 'right center'
  @Input() tooltipColor = 'inherit'
  @Input() tooltipIcon = ''

  @Input() backgroundColor = ''
  @Input() borderColor = ''
  @Input() labelColor = ''

  @Input() type: 'text' | 'email' | 'hidden' | 'password' | 'tel' | 'url' = 'text'

  @Input() maxLength: number | null = null
  @Input() pattern = ''
  @Input() inputMode = ''

  @Output() sharedKeyPress: EventEmitter<KeyboardEvent> = new EventEmitter()
  @Output() sharedKeyPressUp: EventEmitter<KeyboardEvent> = new EventEmitter()
  @Output() sharedFocus: EventEmitter<boolean> = new EventEmitter()
  @Output() sharedValid: EventEmitter<boolean> = new EventEmitter()
  @Output() sharedEmail: EventEmitter<boolean> = new EventEmitter()
  @Output() sharedPhone: EventEmitter<boolean> = new EventEmitter()
  @Output() sharedLink: EventEmitter<boolean> = new EventEmitter()
  @Output() sharedValue: EventEmitter<string> = new EventEmitter()

  @ContentChild('leftLabel')
  leftLabel: TemplateRef<HTMLElement> | null = null
  @ContentChild('rightLabel')
  rightLabel: TemplateRef<HTMLElement> | null = null

  error: boolean | string = false
  timeoutInput!: ReturnType<typeof setTimeout>
  timeStamp = `random-id-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`
  nativeElement: ElementRef

  constructor(
    private validatorHelper: ValidatorHelper,
    public element: ElementRef,
    @Optional() private translate: TranslateService,
  ) {
    this.nativeElement = element.nativeElement
  }

  async validate(isBlur = false) {
    if (this.externalError) {
      this.error = false
    } else if (!!this.required && !this.value) {
      this.sharedValid.emit(false)
      this.setError('formErrors.required')
    } else if (this.type === 'email' && !this.validatorHelper.email(this.value)) {
      this.sharedEmail.emit(false)
      this.setError('formErrors.email')
    } else if (this.type === 'tel' && !this.validatorHelper.phone(this.value)) {
      this.sharedPhone.emit(false)
      this.setError('formErrors.phone')
    } else if (this.type === 'url' && this.value && this.value.length && !this.validatorHelper.url(this.value)) {
      this.sharedLink.emit(false)
      this.setError('formErrors.url')
    } else {
      this.sharedValid.emit(true)
      this.sharedLink.emit(true)
      this.sharedLink.emit(true)
      this.sharedPhone.emit(true)
      this.error = ''
    }

    if (isBlur) {
      this.sharedFocus.emit(false)
    }
  }

  change(event: any): void {
    this.sharedFocus.emit(true)
    this.value = event
    if (this.hasTimeout) {
      clearTimeout(this.timeoutInput)
      this.timeoutInput = setTimeout(() => {
        this.sharedValue.emit(event)
      }, this.timeOutInputTime)
    } else {
      this.sharedValue.emit(event)
    }
    this.validate()
  }

  async setError(key: string) {
    if (this.useFormErrors && this.translate) {
      this.error = await this.translate.instant(key)
    }
  }

  keyDown(event: KeyboardEvent) {
    this.sharedKeyPress.emit(event)
  }

  keyUp(event: KeyboardEvent) {
    this.sharedKeyPressUp.emit(event)
  }
}
