import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef, Optional, ElementRef } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

export interface Option {
  value: any
  label: string
  disabled?: boolean
}

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

  @Output() sharedValue: EventEmitter<any> = new EventEmitter()
  @Output() sharedFocus: EventEmitter<boolean> = new EventEmitter()

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
    } else if (this.required && !this.value && this.useFormErrors && this.translate) {
      this.error = this.translate.instant('formErrors.required')
    } else {
      this.error = ''
    }

    if (isBlur) {
      this.sharedFocus.emit(false)
    }
  }

  change(value: any): void {
    this.sharedFocus.emit(true)
    this.value = value
    this.sharedValue.emit(value)
    this.validate()
  }
}
