import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ElementRef } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { FormsModule } from '@angular/forms'
import { SqInputRangeComponent } from './sq-input-range.component'
import { ValidatorHelper } from '../../helpers/validator.helper'
import { UniversalSafePipe } from 'src/public-api'

describe('SqInputRangeComponent', () => {
  let component: SqInputRangeComponent
  let fixture: ComponentFixture<SqInputRangeComponent>

  beforeEach(async () => {
    const translateServiceStub = {
      instant: jasmine.createSpy('instant').and.returnValue('translated-error'),
    }


    await TestBed.configureTestingModule({
      declarations: [SqInputRangeComponent, UniversalSafePipe],
      imports: [FormsModule],
      providers: [
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('input')) },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SqInputRangeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should set default name if none is provided', () => {
    const regex = /random-name-\d+/
    expect(component.name).toMatch(regex)
  })

  it('should emit valueChange when the value changes', () => {
    spyOn(component.valueChange, 'emit')

    component.change(50)
    fixture.detectChanges()

    expect(component.valueChange.emit).toHaveBeenCalledWith(50)
  })

  it('should emit inFocus when the input is focused', () => {
    spyOn(component.inFocus, 'emit')

    component.change(30)
    fixture.detectChanges()

    expect(component.inFocus.emit).toHaveBeenCalledWith(true)
  })

  it('should emit valid event with true when input is valid', () => {
    spyOn(component.valid, 'emit')

    component.value = 25
    component.required = true
    component.validate()
    fixture.detectChanges()

    expect(component.valid.emit).toHaveBeenCalledWith(true)
  })

  it('should emit valid event with false when input is invalid (required)', () => {
    spyOn(component.valid, 'emit')

    component.value = ''
    component.required = true
    component.validate()
    fixture.detectChanges()

    expect(component.valid.emit).toHaveBeenCalledWith(false)
  })

  it('should apply customClass to the input', () => {
    component.customClass = 'custom-class'
    fixture.detectChanges()

    const wrapperElement = fixture.nativeElement.querySelector('.wrapper-all-inside-input')
    expect(wrapperElement.classList).toContain('custom-class')
  })

  it('should display the correct label and label color', () => {
    component.label = 'Test Label'
    component.labelColor = '#ff0000'
    fixture.detectChanges()

    const labelElement = fixture.nativeElement.querySelector('label div')
    expect(labelElement.textContent).toBe('Test Label')
    expect(labelElement.style.color).toBe('rgb(255, 0, 0)')
  })

  it('should change value position based on value, min, and max', () => {
    component.value = 50
    component.minNumber = 0
    component.maxNumber = 100
    component.changeValuePosition()

    const expectedLeft = `calc(50% - 8px)`
    expect(component.valueFloating.nativeElement.style.left).toBe(expectedLeft)
  })

  it('should handle externalError and set error to false if externalError exists', () => {
    component.externalError = 'External error message'
    component.validate()
    fixture.detectChanges()

    expect(component.error).toBe(false)
  })

  it('should call setError when validation fails', () => {
    spyOn(component, 'setError')
    component.required = true
    component.value = ''

    component.validate()
    fixture.detectChanges()

    expect(component.setError).toHaveBeenCalledWith('forms.required')
  })

  it('should apply step, min, and max values correctly', () => {
    component.step = 5
    component.minNumber = 10
    component.maxNumber = 200
    fixture.detectChanges()

    const inputElement = fixture.nativeElement.querySelector('input[type="range"]')
    expect(inputElement.step).toBe('5')
    expect(inputElement.min).toBe('10')
    expect(inputElement.max).toBe('200')
  })

  it('should translate error messages using TranslateService', async () => {
    component.required = true
    component.value = ''

    await component.setError('forms.required')
    fixture.detectChanges()

    expect(component.error).toBe('translated-error')
  })

  it('should not display the label when label and labelTemplate are absent', () => {
    component.label = ''
    component.labelTemplate = null
    fixture.detectChanges()

    const labelElement = fixture.nativeElement.querySelector('label')
    expect(labelElement).toBeFalsy()
  })

  it('should apply readonly class when the input is in readonly mode', () => {
    component.readonly = true
    component.label = 'Test Label'
    fixture.detectChanges()

    const labelElement = fixture.nativeElement.querySelector('label')
    expect(labelElement.classList).toContain('readonly')
  })

  it('should apply error class when there is an error or externalError', () => {
    // Test internal error
    component.error = 'Test Error'
    fixture.detectChanges()

    const wrapperInput = fixture.nativeElement.querySelector('.wrapper-input')
    expect(wrapperInput.classList).toContain('error')

    // Test external error
    component.error = ''
    component.externalError = 'External Error'
    fixture.detectChanges()

    expect(wrapperInput.classList).toContain('error')
  })

  it('should display error or externalError message in the validation box', () => {
    component.error = 'Test Error'
    fixture.detectChanges()

    const validationBox = fixture.nativeElement.querySelector('.box-invalid')
    expect(validationBox.textContent).toContain('Test Error')

    // Test external error
    component.externalError = 'External Error'
    component.error = ''
    fixture.detectChanges()

    expect(validationBox.textContent).toContain('External Error')
  })

  it('should hide the error message when no error or externalError is present', () => {
    component.error = ''
    component.externalError = ''
    fixture.detectChanges()

    const validationBox = fixture.nativeElement.querySelector('.box-invalid')
    const errorIcon = validationBox.querySelector('i')
    expect(errorIcon.classList).toContain('visibility-hidden-force')
  })

  it('should display the floating value in the output element', () => {
    component.value = 75
    fixture.detectChanges()

    const outputElement = fixture.nativeElement.querySelector('.value-floating')
    expect(outputElement.textContent).toContain('75')
  })

  it('should apply the custom class to the wrapper element', () => {
    component.customClass = 'my-custom-class'
    fixture.detectChanges()

    const wrapperElement = fixture.nativeElement.querySelector('.wrapper-all-inside-input')
    expect(wrapperElement.classList).toContain('my-custom-class')
  })

  it('should not display the label if no label is provided and no template exists', () => {
    component.label = ''
    component.labelTemplate = null
    fixture.detectChanges()

    const labelElement = fixture.nativeElement.querySelector('label')
    expect(labelElement).toBeFalsy()
  })
})
