import { Component, ElementRef, Input, Optional } from '@angular/core'
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
  @Input() override placeholder = 'dd-mm-yyyy'
  @Input()
  public override set value(value: any) {
    this._value = new Date(value)
  }
  public override get value(): any {
    return this._value.toISOString().split('T')[0]
  }

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
    } else if (!!this.required && !this._value) {
      this.valid.emit(false)
      this.setError('formErrors.required')
    } else if (!this.validatorHelper.date(this._value)) {
      this.valid.emit(false)
      this.setError('formErrors.date')
    } else if (this.formatDate(this.minDate) > this._value) {
      this.valid.emit(false)
      this.setError('formErrors.rangeDate')
    } else if (this.formatDate(this.maxDate) < this._value) {
      this.valid.emit(false)
      this.setError('formErrors.rangeDate')
    } else {
      this.valid.emit(true)
      this.error = ''
    }

    if (isBlur) {
      this.inFocus.emit(false)
    }
  }

  override change(event: any): void {
    event = event?.target?.valueAsDate ? event.target.valueAsDate : event?.target?.value || event
    if (!this.disabled && !this.readonly) {
      this.inFocus.emit(true)
      this._value = event
      event = this.getISOValidDate(event)
      if (this.hasTimeout) {
        clearTimeout(this.timeoutInput)
        this.timeoutInput = setTimeout(() => {
          this.valueChange.emit(event)
        }, this.timeOutInputTime)
      } else {
        this.valueChange.emit(event)
      }
      this.validate()
    }
  }

  getISOValidDate(value: Date) {
    try {
      let isoDate = ''
      if (value) {
        isoDate = new Date(value)?.toISOString().split('T')[0] + 'T00:00:00.000Z'
      }
      if (isoDate === 'Invalid date') {
        return ''
      }
      return isoDate
    } catch (error) {
      return ''
    }
  }

  formatDate(value: any) {
    if (!value) {
      return ''
    }
    try {
      return new Date(value).toISOString().split('T')[0]
    } catch (error) {
      return ''
    }
  }
}
