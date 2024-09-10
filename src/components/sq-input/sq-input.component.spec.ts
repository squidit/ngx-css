import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { SqInputComponent } from './sq-input.component'
import { TranslateService } from '@ngx-translate/core'
import { ValidatorHelper } from '../../helpers/validator.helper'
import { ElementRef } from '@angular/core'
import { SqTooltipComponent, UniversalSafePipe } from 'src/public-api'

describe('SqInputComponent', () => {
  let component: SqInputComponent;
  let fixture: ComponentFixture<SqInputComponent>;
  let validatorHelper: ValidatorHelper;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SqInputComponent, SqTooltipComponent, UniversalSafePipe],
      providers: [
        ValidatorHelper,
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('input')) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SqInputComponent);
    component = fixture.componentInstance;
    validatorHelper = TestBed.inject(ValidatorHelper);

    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should display the label if label is provided', () => {
    component.label = 'Example Label'
    fixture.detectChanges()
    const labelElement = fixture.nativeElement.querySelector('label')
    expect(labelElement).toBeTruthy()
    expect(labelElement.textContent.trim()).toBe('Example Label')
  })

  it('should not display the label if label is not provided', () => {
    component.label = ''
    fixture.detectChanges()
    const labelElement = fixture.nativeElement.querySelector('label')
    expect(labelElement).toBeFalsy()
  })

  it('should apply customClass to the wrapper', () => {
    component.customClass = 'custom-input-class'
    fixture.detectChanges()
    const wrapperElement = fixture.nativeElement.querySelector('.wrapper-all-inside-input')
    expect(wrapperElement.classList).toContain('custom-input-class')
  })

  it('should apply readonly class to label when readonly is true', () => {
    component.readonly = true
    component.label = 'Example Label'
    fixture.detectChanges()
    const labelElement = fixture.nativeElement.querySelector('label')
    expect(labelElement.classList).toContain('readonly')
  })

  it('should apply backgroundColor and borderColor to the input', () => {
    component.backgroundColor = '#f0f0f0'
    component.borderColor = '#ff0000'
    fixture.detectChanges()
    const inputElement = fixture.nativeElement.querySelector('input')
    expect(inputElement.style.backgroundColor).toBe('rgb(240, 240, 240)')
    expect(inputElement.style.borderColor).toBe('rgb(255, 0, 0)')
  })

  it('should display externalError and hide error', () => {
    component.externalError = 'External error message'
    component.error = 'Internal error message'
    fixture.detectChanges()
    const errorElement = fixture.nativeElement.querySelector('.box-validation')
    expect(errorElement.textContent.trim()).toBe('External error message')
  })

  it('should display the internal error message when externalError is not set', () => {
    component.externalError = ''
    component.error = 'Internal error message'
    fixture.detectChanges()
    const errorElement = fixture.nativeElement.querySelector('.box-validation')
    expect(errorElement.textContent.trim()).toBe('Internal error message')
  })

  it('should emit valueChange when the input value changes', fakeAsync(() => {
    component.timeToChange = 500
    spyOn(component.valueChange, 'emit')
    const inputElement = fixture.nativeElement.querySelector('input')
    inputElement.value = 'new value'
    inputElement.dispatchEvent(new Event('input'))
    tick(500)
    fixture.detectChanges()
    expect(component.valueChange.emit).toHaveBeenCalledWith('new value')
  }))

  it('should emit keyPressDown when a key is pressed down', () => {
    spyOn(component.keyPressDown, 'emit')
    const inputElement = fixture.nativeElement.querySelector('input')
    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    inputElement.dispatchEvent(event)
    fixture.detectChanges()
    expect(component.keyPressDown.emit).toHaveBeenCalledWith(event)
  })

  it('should emit keyPressUp when a key is released', () => {
    spyOn(component.keyPressUp, 'emit')
    const inputElement = fixture.nativeElement.querySelector('input')
    const event = new KeyboardEvent('keyup', { key: 'Enter' })
    inputElement.dispatchEvent(event)
    fixture.detectChanges()
    expect(component.keyPressUp.emit).toHaveBeenCalledWith(event)
  })
})
