import { Component, ContentChild, ElementRef, EventEmitter, Input, Optional, Output, TemplateRef } from "@angular/core"
import { ValidatorHelper } from '../../helpers/validator.helper'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'sq-textarea',
  templateUrl: './sq-textarea.component.html',
  styleUrls: ['./sq-textarea.component.scss']
})
export class SqTextAreaComponent {
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

  @Input() maxLength: number | null = null

  @Output() keyPressDown: EventEmitter<KeyboardEvent> = new EventEmitter()
  @Output() keyPressUp: EventEmitter<KeyboardEvent> = new EventEmitter()
  @Output() inFocus: EventEmitter<boolean> = new EventEmitter()
  @Output() valid: EventEmitter<boolean> = new EventEmitter()
  @Output() valueChange: EventEmitter<any> = new EventEmitter()

  @ContentChild('leftLabel')
  leftLabel: TemplateRef<HTMLElement> | null = null
  @ContentChild('rightLabel')
  rightLabel: TemplateRef<HTMLElement> | null = null

  error: boolean | string = false
  timeoutInput!: ReturnType<typeof setTimeout>
  timeStamp = `random-id-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`
  nativeElement: ElementRef

  constructor(
    public validatorHelper: ValidatorHelper,
    public element: ElementRef,
    @Optional() public translate: TranslateService
  ) {
    this.nativeElement = element.nativeElement
  }

  async validate(isBlur = false) {
    if (isBlur) {
      this.inFocus.emit(false)
    }
    if (this.externalError) {
      this.error = false
    } else if (this.required && !this.value) {
      this.valid.emit(false)
      this.setError('formErrors.required')
    } else {
      this.valid.emit(true)
      this.error = ''
    }
  }

  change(event: string): void {
    this.inFocus.emit(true)
    if (this.hasTimeout) {
      this.value = event
      clearTimeout(this.timeoutInput)
      this.timeoutInput = setTimeout(() => {
        this.valueChange.emit(event)
      }, this.timeOutInputTime)
    } else {
      this.value = event
      this.valueChange.emit(event)
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