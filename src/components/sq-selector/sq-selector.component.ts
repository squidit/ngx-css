import {
  AfterContentInit,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'sq-selector',
  templateUrl: './sq-selector.component.html',
  styleUrls: ['./sq-selector.component.scss'],
})
export class SqSelectorComponent implements AfterContentInit, OnChanges {
  @Input() name = ''
  @Input() type: 'checkbox' | 'radio' = 'checkbox'
  @Input() id = ''
  @Input() value?: any
  @Input() checked = false
  @Input() indeterminate = false
  @Input() disabled?: boolean
  @Input() readonly?: boolean
  @Input() required?: boolean
  @Input() colorText = ''
  @Input() colorBackground = 'green'
  @Input() hideInput = false
  @Input() toggle = false
  @Input() externalError = ''
  @Input() useFormErrors = true
  @Input() label = ''
  @Input() errorSpan = true

  @Output() sharedValue: EventEmitter<any> = new EventEmitter()

  @ContentChild('rightLabel', { static: true })
  rightLabel: TemplateRef<HTMLElement> | null = null
  @ContentChild('leftLabel', { static: true })
  leftLabel: TemplateRef<HTMLElement> | null = null

  thisChecked = false
  thisIndeterminate = false
  error = ''

  constructor(
    @Optional() public translate: TranslateService
  ) { }

  ngAfterContentInit(): void {
    this.thisChecked = this.checked
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('checked')) {
      this.thisChecked = this.checked
    }
    if (changes.hasOwnProperty('indeterminate')) {
      this.thisIndeterminate = this.indeterminate
    }
  }

  async validate() {
    if (this.externalError) {
      this.error = ''
    } else if (this.required && !this.value && this.useFormErrors && this.translate) {
      this.error = this.translate.instant('formErrors.required')
    } else {
      this.error = ''
    }
  }

  change(event: any): void {
    if (!this.readonly && !this.disabled) {
      if (event.target.checked) {
        this.sharedValue.emit({
          value: this.value,
          checked: true,
        })
        this.thisChecked = true
      } else {
        this.sharedValue.emit({
          value: this.value,
          checked: false,
        })
        this.thisChecked = false
      }
    }
    this.validate()
  }
}
