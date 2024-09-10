import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ElementRef } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ValidatorHelper } from '../../helpers/validator.helper'
import { SqInputDateComponent } from './sq-input-date.component'
import { SqTooltipComponent, UniversalSafePipe } from 'src/public-api'

describe('SqInputDateComponent', () => {
  let component: SqInputDateComponent
  let fixture: ComponentFixture<SqInputDateComponent>
  let validatorHelper: jasmine.SpyObj<ValidatorHelper>
  let translateService: jasmine.SpyObj<TranslateService>

  beforeEach(async () => {
    validatorHelper = jasmine.createSpyObj('ValidatorHelper', ['date'])
    translateService = jasmine.createSpyObj('TranslateService', ['instant'])

    await TestBed.configureTestingModule({
      declarations: [SqInputDateComponent, UniversalSafePipe, SqTooltipComponent],
      providers: [
        { provide: ValidatorHelper, useValue: validatorHelper },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('input')) },
        { provide: TranslateService, useValue: translateService }
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SqInputDateComponent)
    component = fixture.componentInstance
    component.value = ''
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have default minDate and maxDate', () => {
    expect(component.minDate).toBe('0001-01-01')
    expect(component.maxDate).toBe('9999-12-31')
  })

  it('should format date correctly when setting value', () => {
    component.value = '2024-09-09T00:00:00.000Z'
    expect(component.value).toBe('2024-09-09')
  })

  it('should emit valid date when changed', (done: DoneFn) => {
    const testDate = new Date('2024-09-09')
    component.valueChange.subscribe((value: any) => {
      expect(value).toBe('2024-09-09T00:00:00.000Z')
      done()
    })
    component.change({ target: { valueAsDate: testDate } })
  })

  it('should validate required date', async () => {
    component.required = true
    component.value = ''
    validatorHelper.date.and.returnValue(false)
    translateService.instant.and.returnValue('Required')

    await component.validate()

    expect(component.error).toBe('Required')
  })

  it('should validate date within range', async () => {
    component.minDate = '2024-01-01'
    component.maxDate = '2024-12-31'
    component.value = '2025-01-01'
    translateService.instant.and.returnValue('rangeDate')

    await component.validate()

    expect(component.error).toBe('rangeDate')
  })

  it('should call ValidatorHelper to check if date is valid', async () => {
    const validDate = new Date('2024-09-09').toISOString().split('T')[0]
    component._value = validDate
    validatorHelper.date.and.returnValue(true)

    await component.validate()

    expect(validatorHelper.date).toHaveBeenCalledWith(validDate)
  })

  it('should format valid ISO date correctly', () => {
    const formattedDate = component.getISOValidDate(new Date('2024-09-09'))
    expect(formattedDate).toBe('2024-09-09T00:00:00.000Z')
  })

  it('should return empty string for invalid date in getISOValidDate', () => {
    const formattedDate = component.getISOValidDate(new Date('Invalid date'))
    expect(formattedDate).toBe('')
  })

  it('should correctly format date with formatDate method', () => {
    const formattedDate = component.formatDate('2024-09-09')
    expect(formattedDate).toBe('2024-09-09')
  })

  it('should return empty string for invalid date in formatDate method', () => {
    const formattedDate = component.formatDate('Invalid date')
    expect(formattedDate).toBe('')
  })

  it('should render the label if label text is provided', () => {
    component.label = 'Test Label'
    fixture.detectChanges()

    const label = fixture.nativeElement.querySelector('label')
    expect(label).toBeTruthy()
    expect(label.textContent.trim()).toBe('Test Label')
  })

  it('should apply readonly class to label when readonly is true', () => {
    component.readonly = true
    component.label = 'Example Label'
    fixture.detectChanges()

    const label = fixture.nativeElement.querySelector('label')
    expect(label.classList).toContain('readonly')
  })

  it('should format and set the correct value for the date input', () => {
    const date = new Date('2023-09-09')
    component.value = date.toISOString()
    fixture.detectChanges()

    const input = fixture.nativeElement.querySelector('input')
    expect(input.value).toBe('2023-09-09')
  })

  it('should set min and max dates correctly', () => {
    component.minDate = '2023-01-01'
    component.maxDate = '2023-12-31'
    fixture.detectChanges()

    const input = fixture.nativeElement.querySelector('input')
    expect(input.getAttribute('min')).toBe('2023-01-01')
    expect(input.getAttribute('max')).toBe('2023-12-31')
  })

  it('should display error icon and message when error is present', () => {
    component.error = 'This is an error'
    fixture.detectChanges()

    const errorIcon = fixture.nativeElement.querySelector('.fa-triangle-exclamation')
    const errorMessage = fixture.nativeElement.querySelector('.box-validation')

    expect(errorIcon).toBeTruthy()
    expect(errorMessage.textContent).toContain('This is an error')
  })

  it('should call change method when input value changes', () => {
    spyOn(component, 'change')

    const input = fixture.nativeElement.querySelector('input')
    input.value = '2023-09-10'
    input.dispatchEvent(new Event('change'))

    fixture.detectChanges()
    expect(component.change).toHaveBeenCalled()
  })

  it('should call validate method on blur', () => {
    spyOn(component, 'validate')

    const input = fixture.nativeElement.querySelector('input')
    input.dispatchEvent(new Event('blur'))

    fixture.detectChanges()
    expect(component.validate).toHaveBeenCalledWith(true)
  })

})
