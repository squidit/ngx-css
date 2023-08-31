import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef, Optional, ElementRef } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Option } from '../../interfaces/option.interface'

@Component({
  selector: 'sq-select',
  templateUrl: './sq-select.component.html',
  styleUrls: ['./sq-select.component.scss']
})
export class SqSelectComponent {
  @Input() name = ''
  @Input() value?: any
  @Input() id = ''
  @Input() label = ''
  @Input() customClass = ''

  @Input() placeholder = ''
  @Input() externalError = ''
  @Input() externalIcon = ''
  @Input() options: Option[] = []
  @Input() optionsWithGroups: Array<{
    label: string
    options: Option[]
  }> = []

  @Input() errorSpan = true
  @Input() disabled = false
  @Input() readonly = false
  @Input() required = false
  @Input() loading = false
  @Input() useFormErrors = true

  @Input() tooltipMessage = ''
  @Input() tooltipPlacement: 'center top' | 'center bottom' | 'left center' | 'right center' = 'right center'
  @Input() tooltipColor = 'inherit'
  @Input() tooltipIcon = ''

  @Input() backgroundColor = ''
  @Input() borderColor = ''
  @Input() labelColor = ''

  @ContentChild('leftLabel')
  leftLabel: TemplateRef<HTMLElement> | null = null
  @ContentChild('rightLabel')
  rightLabel: TemplateRef<HTMLElement> | null = null

  @Output() inFocus: EventEmitter<boolean> = new EventEmitter()
  @Output() valid: EventEmitter<boolean> = new EventEmitter()
  @Output() valueChange: EventEmitter<any> = new EventEmitter()

  error: boolean | string = false
  timeoutInput!: ReturnType<typeof setTimeout>
  timeOutInputTime = 800
  timeStamp = `random-id-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`
  nativeElement: ElementRef

  constructor(public element: ElementRef, @Optional() private translate: TranslateService) {
    this.nativeElement = element.nativeElement
  }

  validate(isBlur = false) {
    if (this.externalError) {
      this.error = false
    } else if (this.required && !this.value) {
      this.valid.emit(false)
      this.setError('formErrors.required')
    } else {
      this.valid.emit(true)
      this.error = ''
    }

    if (isBlur) {
      this.inFocus.emit(false)
    }
  }

  async setError(key: string) {
    if (this.useFormErrors && this.translate) {
      this.error = await this.translate.instant(key)
    }
  }

  change(value: any): void {
    this.inFocus.emit(true)
    this.value = value
    this.valueChange.emit(value)
    this.validate()
  }
}
