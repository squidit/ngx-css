import { Component, ElementRef, EventEmitter, Input, Optional, Output } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Option } from '../../interfaces/option.interface'
import { useMemo } from '../../helpers/memo.helper'

@Component({
  selector: 'sq-select-search',
  templateUrl: './sq-select-search.component.html',
  styleUrls: ['./sq-select-search.component.scss'],
  providers: [],
})
export class SqSelectSearchComponent {
  @Input() name = ''
  @Input() value?: Option
  @Input() id = ''
  @Input() label = ''
  @Input() customClass = ''

  @Input() placeholder = ''
  @Input() externalError = ''
  @Input() externalIcon = ''
  @Input() placeholderSearch = ''

  @Input() disabled = false
  @Input() readonly = false
  @Input() required = false
  @Input() loading = false
  @Input() useFormErrors = true
  @Input() errorSpan = true
  @Input() hasTimeout = false

  @Input() options: Array<Option> = []

  @Input() backgroundColor = ''
  @Input() borderColor = ''
  @Input() labelColor = ''

  @Input() tooltipMessage = ''
  @Input() tooltipPlacement: 'center top' | 'center bottom' | 'left center' | 'right center' = 'right center'
  @Input() tooltipColor = 'inherit'
  @Input() tooltipIcon = ''

  @Output() valueChange: EventEmitter<Option> = new EventEmitter()
  @Output() searchChange: EventEmitter<string> = new EventEmitter()
  @Output() valid: EventEmitter<boolean> = new EventEmitter()

  error: boolean | string = false
  timeoutInput!: ReturnType<typeof setTimeout>
  timeOutInputTime = 800
  timeStamp = `random-id-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`
  nativeElement: ElementRef
  searchText = ''
  open = false

  constructor(public element: ElementRef, @Optional() private translate: TranslateService) {
    this.nativeElement = element.nativeElement
  }

  emit(event: any) {
    this.value = event
    this.valueChange.emit(this.value)
    this.validate()
    this.closeDropdown()
  }

  validate() {
    if (this.externalError) {
      this.error = false
    } else if (this.required && !this.value) {
      this.setError('formErrors.required')
      this.valid.emit(false)
    } else {
      this.valid.emit(true)
      this.error = ''
    }
  }

  getSearchValue() {
    return this.searchText || ''
  }

  closeDropdown() {
    this.open = false
    this.searchText = ''
  }

  onTipSearchChange(event: string) {
    this.searchText = event
    this.searchChange.emit(event)
  }

  async setError(key: string) {
    if (this.useFormErrors && this.translate) {
      this.error = await this.translate.instant(key)
    }
  }

  getTranslation = useMemo(async (key: string) => {
    if (this.translate) {
      return await this.translate.instant(key)
    }
    return ''
  })
}
