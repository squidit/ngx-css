import { Component, ContentChild, ElementRef, Input, Optional, TemplateRef } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ValidatorHelper } from '../../helpers/validator.helper'
import { SqInputComponent } from '../sq-input/sq-input.component'

/**
 * Represents a date input component that extends SqInputComponent.
 * 
 * This component extends the {@link SqInputComponent} and adds additional properties and behavior for handling money input.
 * 
 * <br>
 * <label for='id-exemple-date'>
 *  Example Input
 * </label>
 * <input
 *   class='input mb-3'
 *   name="name-exemple-date"
 *   id="id-exemple-date"
 *   type="date"
 * ></input>
 * 
 * @example
 * <sq-input-date [name]="'date-input'" [id]="'date-input'" [label]="'Date'" [(value)]='date'></sq-input-date>
 */
@Component({
  selector: 'sq-input-date',
  templateUrl: './sq-input-date.component.html',
  styleUrls: ['./sq-input-date.component.scss']
})
export class SqInputDateComponent extends SqInputComponent {
  /**
   * Minimum allowed date in 'yyyy-mm-dd' format.
   */
  @Input() minDate = '0001-01-01'

  /**
   * Maximum allowed date in 'yyyy-mm-dd' format.
   */
  @Input() maxDate = '9999-12-31'

  /**
   * Placeholder text for the date input.
   */
  @Input() override placeholder = 'dd-mm-yyyy'

  /**
   * The value of the input element in 'yyyy-mm-dd' format.
   */
  @Input()
  public override set value(value: any) {
    value = value.split('T')[0] || value
    this._value = new Date(value)
  }
  public override get value(): any {
    return this._value.toISOString().split('T')[0]
  }

  /**
   * Reference to a label template.
   */
  @ContentChild('labelTemplate')
  override labelTemplate: TemplateRef<HTMLElement> | null = null

  /**
   * Constructs a new instance of SqInputDateComponent.
   * @param validatorHelper - The ValidatorHelper service for input validation.
   * @param element - Reference to the native element.
   * @param translate - The TranslateService for translation support (optional).
   */
  constructor(
    public override validatorHelper: ValidatorHelper,
    element: ElementRef,
    @Optional() public override translate: TranslateService,
  ) {
    super(validatorHelper, element, translate)
    this.nativeElement = element.nativeElement
  }

  /**
   * Asynchronously validate the date input value.
   * @param isBlur - Indicates if the input has lost focus.
   */
  override async validate(isBlur = false) {
    if (this.externalError) {
      this.error = false
    } else if (!!this.required && !this._value) {
      this.valid.emit(false)
      this.setError('forms.required')
    } else if (!this.validatorHelper.date(this._value)) {
      this.valid.emit(false)
      this.setError('forms.date')
    } else if (this.formatDate(this.minDate) > this._value) {
      this.valid.emit(false)
      this.setError('forms.rangeDate')
    } else if (this.formatDate(this.maxDate) < this._value) {
      this.valid.emit(false)
      this.setError('forms.rangeDate')
    } else {
      this.valid.emit(true)
      this.error = ''
    }

    if (isBlur) {
      this.inFocus.emit(false)
    }
  }

  /**
   * Handle the change event for the date input.
   * @param event - The input change event.
   */
  override async change(event: any) {
    event = event?.target?.valueAsDate ? event.target.valueAsDate : event?.target?.value || event
    if (!this.disabled && !this.readonly) {
      this.inFocus.emit(true)
      this._value = event
      clearTimeout(this.timeoutInput)
      this.timeoutInput = setTimeout(() => {
        this.valueChange.emit(this.getISOValidDate(event))
      }, this.timeToChange)
      this.validate()
    }
  }

  /**
   * Get the ISO-formatted valid date from a Date object.
   * @param value - The Date object to format.
   * @returns The ISO-formatted date string.
   */
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

  /**
   * Format a value as an ISO date string.
   * @param value - The value to format as an ISO date string.
   * @returns The ISO date string.
   */
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
