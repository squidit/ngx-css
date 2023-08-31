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

  @Output() valueChange: EventEmitter<string> = new EventEmitter()
  @Output() inFocus: EventEmitter<boolean> = new EventEmitter()
  @Output() valid: EventEmitter<boolean> = new EventEmitter()

  @ViewChild('valueFloating') valueFloating!: ElementRef
  @ViewChild('input') input!: ElementRef

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
      this.valid.emit(false)
    } else {
      this.valid.emit(true)
      this.error = ''
    }
    if (isBlur) {
      this.inFocus.emit(false)
    }
  }

  changeValuePosition() {
    const val = parseFloat(this.value)
    const min = this.minNumber ? this.minNumber : 0
    const max = this.maxNumber ? this.maxNumber : 100
    const newVal = Number(((val - min) * 100) / (max - min))
    if (this.valueFloating) {
      this.valueFloating.nativeElement.style.left = `calc(${newVal}% + (${10 - newVal * 0.36}px))`
    }
  }

  change(event: any): void {
    this.inFocus.emit(true)
    this.changeValuePosition()
    this.value = event
    this.valueChange.emit(event)
    this.validate()
  }

  async setError(key: string) {
    if (this.useFormErrors && this.translate) {
      this.error = await this.translate.instant(key)
    }
  }
}
