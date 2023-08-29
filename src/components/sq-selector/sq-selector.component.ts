import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'sq-selector',
  templateUrl: './sq-selector.component.html',
  styleUrls: ['./sq-selector.component.scss'],
})
export class SqSelectorComponent implements OnChanges {
  @Input() name = ''
  @Input() type: 'checkbox' | 'radio' = 'checkbox'
  @Input() id = ''
  @Input() value: any = ''
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

  @ContentChild('rightLabel')
  rightLabel: TemplateRef<HTMLElement> | null = null
  @ContentChild('leftLabel')
  leftLabel: TemplateRef<HTMLElement> | null = null

  thisChecked = false
  thisIndeterminate = false
  error = ''
  context: any = {
    checked: this.thisChecked,
    indeterminate: !this.thisChecked ? this.thisIndeterminate : false,
    value: this.value
  }

  constructor(
    @Optional() public translate: TranslateService
  ) { }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('checked')) {
      this.thisChecked = this.checked
      this.context.checked = this.thisChecked
    }
    if (changes.hasOwnProperty('indeterminate')) {
      this.thisIndeterminate = this.indeterminate
      this.context.indeterminate = !this.thisChecked ? this.thisIndeterminate : false
    }
    if (changes.hasOwnProperty('value')) {
      this.context.value = this.value
    }
  }

  async validate() {
    if (this.externalError) {
      this.error = ''
    } else if (this.required && !this.thisChecked && this.useFormErrors && this.translate) {
      this.error = this.translate.instant('formErrors.required')
    } else {
      this.error = ''
    }
  }

  change(event: any): void {
    if (!this.readonly && !this.disabled) {
      this.sharedValue.emit({
        value: this.value,
        checked: event?.target?.checked,
      })
      this.thisChecked = event?.target?.checked
    }
    this.validate()
  }
}
