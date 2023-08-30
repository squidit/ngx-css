import { Component, ElementRef, EventEmitter, Input, Optional, Output } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ValidatorHelper } from '../../helpers/validator.helper'
import { SqInputComponent } from '../sq-input/sq-input.component'

@Component({
  selector: 'sq-input-date',
  templateUrl: './sq-input-date.component.html',
  styleUrls: ['./sq-input-date.component.scss']
})
export class SqInputDateComponent extends SqInputComponent {
  @Input() minDate = '0001-01-01'
  @Input() maxDate = '9999-12-31'

  @Output() sharedDate: EventEmitter<boolean> = new EventEmitter()

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
    } else if (!!this.required && !this.value) {
      this.sharedValid.emit(false)
      this.setError('formErrors.required')
    } else if (!this.validatorHelper.date(this.value)) {
      this.sharedDate.emit(false)
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


    if (this.externalError) {
      this.error = false
    } else if (!!this.required && !this.value) {
      this.sharedValid.emit(false)
      this.setError('formErrors.required')
    } else if (!this.validatorHelper.date(this.value)) {
      this.sharedDate.emit(false)
      this.setError('formErrors.date')
    } else if (this.formatDate(this.minDate) > this.formatDate(this.value)) {
      this.sharedDate.emit(false)
      this.setError('formErrors.rangeDate')
    } else if (this.formatDate(this.maxDate) < this.formatDate(this.value)) {
      this.sharedDate.emit(false)
      this.setError('formErrors.rangeDate')
    } else {
      this.sharedValid.emit(true)
      this.sharedLink.emit(true)
      this.sharedLink.emit(true)
      this.sharedPhone.emit(true)
      this.sharedDate.emit(true)
      this.error = ''
    }

    if (isBlur) {
      this.sharedFocus.emit(false)
    }
  }

  override change(event: any): void {
    event = event?.target?.valueAsDate ? event.target.valueAsDate : event?.target?.value || event
    if (!this.disabled && !this.readonly) {
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
  }

  formatDate(value: any) {
    return (value && new Date(value).toISOString().split('T')[0]) || ''
  }
}
