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
  @Input()
  public set value(value: any) {
    this._value = value
  }
  public get value(): any {
    return this._value
  }

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

  @Output() keyPressDown: EventEmitter<KeyboardEvent> = new EventEmitter()
  @Output() keyPressUp: EventEmitter<KeyboardEvent> = new EventEmitter()
  @Output() inFocus: EventEmitter<boolean> = new EventEmitter()
  @Output() valid: EventEmitter<boolean> = new EventEmitter()
  @Output() valueChange: EventEmitter<any> = new EventEmitter()

  @ContentChild('leftLabel')
  leftLabel: TemplateRef<HTMLElement> | null = null
  @ContentChild('rightLabel')
  rightLabel: TemplateRef<HTMLElement> | null = null

  _value: any = ''
  error: boolean | string = false
  timeoutInput!: ReturnType<typeof setTimeout>
  timeStamp = `random-id-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`
  nativeElement: ElementRef

  constructor(
    public validatorHelper: ValidatorHelper,
    element: ElementRef,
    @Optional() public translate: TranslateService,
  ) {
    this.nativeElement = element.nativeElement
  }

  async validate(isBlur = false) {
    if (this.externalError) {
      this.error = false
    } else if (!!this.required && !this.value) {
      this.valid.emit(false)
      this.setError('formErrors.required')
    } else if (this.type === 'email' && !this.validatorHelper.email(this.value)) {
      this.valid.emit(false)
      this.setError('formErrors.email')
    } else if (this.type === 'tel' && !this.validatorHelper.phone(this.value)) {
      this.valid.emit(false)
      this.setError('formErrors.phone')
    } else if (this.type === 'url' && this.value && this.value.length && !this.validatorHelper.url(this.value)) {
      this.valid.emit(false)
      this.setError('formErrors.url')
    } else {
      this.valid.emit(true)
      this.error = ''
    }

    if (isBlur) {
      this.inFocus.emit(false)
    }
  }

  change(event: any): void {
    this.inFocus.emit(true)
    this._value = event
    if (this.hasTimeout) {
      clearTimeout(this.timeoutInput)
      this.timeoutInput = setTimeout(() => {
        this.valueChange.emit(this.value)
      }, this.timeOutInputTime)
    } else {
      this.valueChange.emit(this.value)
    }
    this.validate()
  }

  async setError(key: string) {
    if (this.useFormErrors && this.translate) {
      this.error = await this.translate.instant(key)
    }
  }

  keyDown(event: KeyboardEvent) {
    this.keyPressDown.emit(event)
  }

  keyUp(event: KeyboardEvent) {
    this.keyPressUp.emit(event)
  }
}
