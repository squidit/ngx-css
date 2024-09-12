import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { SqSelectorComponent } from './sq-selector.component'
import { FormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'

describe('SqSelectorComponent', () => {
  let component: SqSelectorComponent
  let fixture: ComponentFixture<SqSelectorComponent>
  let translateService: TranslateService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SqSelectorComponent],
      imports: [FormsModule, TranslateModule.forRoot()],
      providers: [TranslateService]
    }).compileComponents()

    fixture = TestBed.createComponent(SqSelectorComponent)
    component = fixture.componentInstance
    translateService = TestBed.inject(TranslateService)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should emit valueChange event on change', () => {
    spyOn(component.valueChange, 'emit')
    const input = fixture.debugElement.query(By.css('input')).nativeElement
    input.checked = true
    input.dispatchEvent(new Event('change'))
    fixture.detectChanges()
    expect(component.valueChange.emit).toHaveBeenCalledWith({
      value: component.value,
      checked: true,
    })
  })

  it('should validate and set error message when required and not checked', async () => {
    spyOn(component.valid, 'emit')
    component.required = true
    component.checked = false
    spyOn(translateService, 'instant').and.returnValue('This field is required')
    await component.validate()
    expect(component.error).toBe('This field is required')
    expect(component.valid.emit).toHaveBeenCalledWith(false)
  })

  it('should clear error message when externalError is set', async () => {
    component.externalError = 'External error'
    await component.validate()
    expect(component.error).toBe('')
  })

  it('should set error message using setError method', async () => {
    spyOn(translateService, 'instant').and.returnValue('Translated error')
    await component.setError('error.key')
    expect(component.error).toBe('Translated error')
  })

  it('should update context on input changes', async () => {
    component.checked = true
    component.indeterminate = true
    component.value = 'newValue'
    await component.ngOnChanges({
      checked: { currentValue: true, previousValue: false, firstChange: true, isFirstChange: () => true },
      indeterminate: { currentValue: true, previousValue: false, firstChange: true, isFirstChange: () => true },
      value: { currentValue: 'newValue', previousValue: '', firstChange: true, isFirstChange: () => true },
    })
    expect(component.context.checked).toBe(true)
    expect(component.context.indeterminate).toBe(false)
    expect(component.context.value).toBe('newValue')
  })
})