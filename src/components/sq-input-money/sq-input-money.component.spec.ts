import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { ElementRef, SimpleChanges } from '@angular/core'
import { SqInputMoneyComponent } from './sq-input-money.component'
import { ValidatorHelper } from '../../helpers/validator.helper'
import { SqInputMaskComponent, SqTooltipComponent, SqTooltipDirective, UniversalSafePipe } from 'src/public-api'
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask'
import { FormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'

describe('SqInputMoneyComponent', () => {
  let component: SqInputMoneyComponent
  let fixture: ComponentFixture<SqInputMoneyComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, NgxMaskDirective],
      declarations: [SqInputMoneyComponent, SqInputMaskComponent, SqTooltipComponent, SqTooltipDirective, UniversalSafePipe],
      providers: [
        ValidatorHelper,
        provideNgxMask(),
        { provide: ElementRef, useValue: new ElementRef(document.createElement('input')) }]
    }).compileComponents()

    fixture = TestBed.createComponent(SqInputMoneyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should set the correct initial value', () => {
    component.value = '1234.56'
    fixture.detectChanges()
    expect(component.value).toBe(1234.56)
  })

  it('should emit valueChange when the value changes', fakeAsync(() => {
    spyOn(component.valueChange, 'emit')

    const newValue = 5678
    component.change(newValue)
    component.timeToChange = 500
    tick(500)
    fixture.detectChanges()

    expect(component.valueChange.emit).toHaveBeenCalledWith(5678)
  }))

  it('should show the correct tooltip message', () => {
    component.tooltipMessage = 'This is a tooltip'
    fixture.detectChanges()

    const tooltip = fixture.nativeElement.querySelector('sq-tooltip')
    expect(tooltip).toBeTruthy()
    expect(tooltip.getAttribute('ng-reflect-message')).toBe('This is a tooltip')
  })

  it('should apply the customClass to the component', () => {
    component.customClass = 'custom-input-class'
    fixture.detectChanges()

    const wrapper = fixture.nativeElement.querySelector('.wrapper-all-inside-input')
    expect(wrapper.classList).toContain('custom-input-class')
  })

  it('should handle external error correctly', () => {
    component.externalError = 'An error occurred'
    fixture.detectChanges()

    const errorElement = fixture.nativeElement.querySelector('.box-validation')
    expect(errorElement).toBeTruthy()
    expect(errorElement.textContent).toContain('An error occurred')
  })

  it('should add the readonly and disabled classes when the components disabled and readonly properties are set to true', () => {
    component.disabled = true
    component.readonly = true
    fixture.detectChanges()

    const inputElement = fixture.nativeElement.querySelector('input')

    expect(inputElement.classList).toContain('readonly')
    expect(inputElement.classList).toContain('disabled')
  })

  it('should apply labelColor and borderColor', () => {
    component.label = 'Test'
    component.labelColor = 'rgb(255, 0, 0)'
    component.borderColor = '#00FF00'
    fixture.detectChanges()

    const label = fixture.nativeElement.querySelector('label div')
    expect(label.style.color).toBe('rgb(255, 0, 0)')

    const input = fixture.nativeElement.querySelector('input')
    expect(input.style.borderColor).toBe('rgb(0, 255, 0)')
  })

  it('should display the correct prefix based on the currency', () => {
    component.currency = 'USD'
    component.ngOnChanges({
      currency: {
        currentValue: 'USD',
        previousValue: 'BRL',
        firstChange: false,
        isFirstChange: () => false,
      },
    })
    fixture.detectChanges()

    const leftLabel = fixture.nativeElement.querySelector('span.input-group-text')
    expect(leftLabel.textContent).toContain('$')
  })
})
