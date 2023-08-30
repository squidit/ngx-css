import { AfterContentInit, Component, ElementRef, EventEmitter, Input, OnChanges, Optional, Output, SimpleChanges, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ValidatorHelper } from '../../helpers/validator.helper'

@Component({
  selector: 'sq-input-range',
  templateUrl: './sq-input-range.component.html',
  styleUrls: ['./sq-input-range.component.scss']
})
export class SqInputRangeComponent implements AfterContentInit, OnChanges {
  @Input() customClass = ''
  @Input() name?: string
  @Input() id?: string
  @Input() value = '0'
  @Input() readonly = false
  @Input() required = false
  @Input() label = ''
  @Input() color = 'var(--pink)'
  @Input() labelColor = ''
  @Input() errorSpan = true
  @Input() externalError?: any
  @Input() step = 1
  @Input() minNumber = 0
  @Input() maxNumber = 100
  @Input() useFormErrors = true

  @Output() sharedValue: EventEmitter<string> = new EventEmitter()
  @Output() sharedFocus: EventEmitter<boolean> = new EventEmitter()
  @Output() sharedValid: EventEmitter<boolean> = new EventEmitter()

  @ViewChild('valueFloating') valueFloating!: ElementRef
  @ViewChild('bar') bar!: ElementRef
  @ViewChild('barFully') barFully!: ElementRef
  @ViewChild('circle') circle!: ElementRef

  error: boolean | string = false
  timeoutInput!: ReturnType<typeof setTimeout>
  timeStamp = `random-id-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`
  nativeElement: ElementRef

  constructor(
    public validatorHelper: ValidatorHelper,
    element: ElementRef,
    @Optional() public translate: TranslateService,
  ) {
    this.nativeElement = element.nativeElement
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.changeValuePosition()
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('value') || changes.hasOwnProperty('minNumber') || changes.hasOwnProperty('maxNumber')) {
      this.changeValuePosition()
    }
  }

  validate(isBlur = false) {
    if (this.externalError) {
      this.error = false
    } else if (!!this.required && !this.value && this.value !== '0') {
      this.setError('formErrors.required')
    }
    if (isBlur) {
      this.sharedFocus.emit(false)
    }
  }

  changeValuePosition() {
    const newValue = Number(((parseInt(this.value, 10) - this.minNumber) * 100) / (this.maxNumber - this.minNumber))
    const newPosition = 6 - newValue * 0.26
    const newPositionCircle = -3 - newValue * 0.2
    if (this.circle) {
      this.circle.nativeElement.style.left = `calc(${newValue < 101 ? newValue : 100}% + (${newPositionCircle}px))`
    }
    if (this.valueFloating) {
      this.valueFloating.nativeElement.style.left = `calc(${newValue < 101 ? newValue : 100}% + (${newPosition}px))`
    }
    if (this.barFully) {
      this.barFully.nativeElement.style.width = `${newValue < 101 ? newValue : 100}%`
    }
  }

  change(event: any): void {
    this.sharedFocus.emit(true)
    this.changeValuePosition()
    this.value = event
    this.sharedValue.emit(event)
    this.validate()
  }

  async setError(key: string) {
    if (this.useFormErrors && this.translate) {
      this.error = await this.translate.instant(key)
    }
  }
}
