import { Component, ElementRef, EventEmitter, Input, Optional, Output } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { OptionMulti } from '../../interfaces/option.interface'
import { useMemo } from '../../helpers/memo.helper'

@Component({
  selector: 'sq-select-multi-tags',
  templateUrl: './sq-select-multi-tags.component.html',
  styleUrls: ['./sq-select-multi-tags.component.scss'],
  providers: [],
})
export class SqSelectMultiTagsComponent {
  @Input() name = ''
  @Input() value?: OptionMulti[] = []
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

  @Input() backgroundColor = ''
  @Input() borderColor = ''
  @Input() labelColor = ''

  @Input() options: Array<OptionMulti> = []

  @Input() showInside = true
  @Input() hideSearch = false

  @Input() tooltipMessage = ''
  @Input() tooltipPlacement: 'center top' | 'center bottom' | 'left center' | 'right center' = 'right center'
  @Input() tooltipColor = 'inherit'
  @Input() tooltipIcon = ''

  @Output() valueChange: EventEmitter<Array<any>> = new EventEmitter()
  @Output() closeChange: EventEmitter<any> = new EventEmitter()
  @Output() removeTag: EventEmitter<any> = new EventEmitter()
  @Output() valid: EventEmitter<boolean> = new EventEmitter()

  open = false
  searchText = ''
  valueChanged = false
  timeouted = false
  error: boolean | string = false
  timeoutInput!: ReturnType<typeof setTimeout>
  timeOutInputTime = 800
  timeStamp = `random-id-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`
  nativeElement: ElementRef

  constructor(public element: ElementRef, @Optional() private translate: TranslateService) {
    this.nativeElement = element.nativeElement
  }

  findItemInValue = useMemo((item: OptionMulti) => {
    return !!this.value?.find((value) => value.value === item.value)
  })

  verifyIfOptionsHasChildren = useMemo((options: OptionMulti[]) => {
    return options.some((item) => item.children?.length)
  })

  verifyIfHasChildrenInValue = useMemo((item: OptionMulti) => {
    if (item.children?.length) {
      const hasAllChildren = item.children.every((child) => this.findItemInValue(child))
      if (hasAllChildren && !this.findItemInValue(item) && !this.timeouted) {
        this.timeouted = true
        setTimeout(() => {
          this.emit(item, true)
          this.timeouted = false
        }, 0)
      }
      return !!item.children.find((child) => this.findItemInValue(child))
    }
    return false
  })

  removeItem(item: OptionMulti) {
    if (item.children?.length) {
      item.children.forEach((child) => {
        this.value = this.value?.filter((value) => value.value !== child.value)
      })
    }
    this.value = this.value?.filter((value) => value.value !== item.value)

    this.valueChange.emit(this.value)
    this.removeTag.emit(item)
    this.validate()
  }

  emit(object: OptionMulti, checked: boolean) {
    if (checked) {
      this.value?.push(object)
      // This code adds all children of a parent to value. Commented out for now as it is not the desired behavior.
      // if (object.children?.length) {
      //   object.children.forEach((item) => {
      //     if (!this.value.find((child) => child.value === item.value)) {
      //       this.value.push(item)
      //     }
      //   })
      // }
    } else {
      this.value = this.value?.filter((item) => item.value !== object.value)
      if (object.children?.length) {
        object.children.forEach((item) => {
          this.value = this.value?.filter((child) => child.value !== item.value)
        })
      }
    }
    this.valueChanged = true
    this.valueChange.emit(this.value)
    this.validate()
  }

  getSearchValue() {
    return this.searchText || ''
  }

  closeDropdown() {
    this.open = false
    this.searchText = ''
    this.closeChange.emit(this.valueChanged)
    this.valueChanged = false
  }

  handleCollapse(item: OptionMulti) {
    item.open = !item.open
  }

  async setError(key: string) {
    if (this.useFormErrors && this.translate) {
      this.error = await this.translate.instant(key)
    }
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

  getTranslation = useMemo(async (key: string) => {
    if (this.translate) {
      return await this.translate.instant(key)
    }
    return ''
  })
}
