import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { SqInputMaskComponent } from './sq-input-mask.component'
import { ValidatorHelper } from '../../helpers/validator.helper'
import { ElementRef } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'
import { By } from '@angular/platform-browser'
import { SqTooltipComponent, SqTooltipDirective, UniversalSafePipe } from 'src/public-api'

describe('SqInputMaskComponent', () => {
  let component: SqInputMaskComponent
  let fixture: ComponentFixture<SqInputMaskComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, NgxMaskDirective],
      declarations: [SqInputMaskComponent, UniversalSafePipe, SqTooltipComponent, SqTooltipDirective],
      providers: [
        ValidatorHelper,
        { provide: ElementRef, useValue: new ElementRef(document.createElement('input')) },
        provideNgxMask()
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(SqInputMaskComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should display the label if label is provided', () => {
    component.label = 'Test Label'
    fixture.detectChanges()

    const labelElement = fixture.debugElement.query(By.css('label div')).nativeElement
    expect(labelElement.innerHTML).toContain('Test Label')
  })

  it('should display tooltip when tooltipMessage is provided', () => {
    component.tooltipMessage = 'Test Tooltip'
    fixture.detectChanges()

    const tooltipElement = fixture.debugElement.query(By.css('sq-tooltip')).nativeElement
    expect(tooltipElement).toBeTruthy()
    expect(tooltipElement.getAttribute('ng-reflect-message')).toBe('Test Tooltip')
  })

  it('should apply readonly class when readonly is true', () => {
    component.readonly = true
    fixture.detectChanges()

    const wrapperDiv = fixture.debugElement.query(By.css('.wrapper-input')).nativeElement
    expect(wrapperDiv.classList).toContain('readonly')
  })

  it('should apply error class when error is present', () => {
    component.error = 'Sample Error'
    fixture.detectChanges()

    const wrapperDiv = fixture.debugElement.query(By.css('.wrapper-input')).nativeElement
    expect(wrapperDiv.classList).toContain('error')
  })

  it('should apply externalError when externalError is present', () => {
    component.externalError = 'External Error'
    fixture.detectChanges()

    const errorDiv = fixture.debugElement.query(By.css('.box-validation')).nativeElement
    expect(errorDiv.textContent).toContain('External Error')
  })

  it('should show remaining characters when maxLength is set', () => {
    component.maxLength = 10
    component.value = 'Test'
    fixture.detectChanges()

    const maxLengthSpan = fixture.debugElement.query(By.css('.max-length-name')).nativeElement
    expect(maxLengthSpan.textContent).toContain('6') // 10 - 4 = 6
  })

  it('should emit focus event on input focus', () => {
    spyOn(component.emitFocus, 'emit')
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement

    inputElement.dispatchEvent(new Event('focus'))
    fixture.detectChanges()

    expect(component.emitFocus.emit).toHaveBeenCalled()
  })

  it('should emit valid false and set error when required and no value is provided', async () => {
    component.required = true
    component.value = ''
    spyOn(component.valid, 'emit')
    spyOn(component, 'setError')

    await component.validate()

    expect(component.valid.emit).toHaveBeenCalledWith(false)
    expect(component.setError).toHaveBeenCalledWith('forms.required')
  })

  it('should emit valid false and set error when value exceeds maxValue', async () => {
    component.maxValue = 100
    component.value = '150'
    spyOn(component.valid, 'emit')
    spyOn(component, 'setError')

    await component.validate()

    expect(component.valid.emit).toHaveBeenCalledWith(false)
    expect(component.setError).toHaveBeenCalledWith('forms.maxValueAllowed', { max: 100 })
  })

  it('should apply readonly, disabled, and error classes correctly on input', () => {
    component.readonly = true
    component.disabled = true
    component.error = 'Error'
    fixture.detectChanges()

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement
    expect(inputElement.classList).toContain('readonly')
    expect(inputElement.classList).toContain('disabled')
    expect(inputElement.classList).toContain('has-icon')
  })

  it('should apply ngModelChange and trigger change method', () => {
    spyOn(component, 'change')
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement

    inputElement.dispatchEvent(new Event('input'))
    fixture.detectChanges()

    expect(component.change).toHaveBeenCalled()
  })
})
