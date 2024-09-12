import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateService } from '@ngx-translate/core'
import { SqSelectComponent } from './sq-select.component'
import { ElementRef } from '@angular/core'
import { By } from '@angular/platform-browser'
import { SqTooltipComponent, SqTooltipDirective } from 'src/public-api'

describe('SqSelectComponent', () => {
  let component: SqSelectComponent
  let fixture: ComponentFixture<SqSelectComponent>
  let mockTranslateService: jasmine.SpyObj<TranslateService>

  beforeEach(async () => {
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant'])
    mockTranslateService.instant.and.callFake((key: string) => key)

    await TestBed.configureTestingModule({
      declarations: [SqSelectComponent, SqTooltipComponent, SqTooltipDirective],
      providers: [
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) }
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SqSelectComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should emit valueChange and validate on change', () => {
    spyOn(component.valueChange, 'emit')
    spyOn(component, 'validate')

    const value = 'test'
    component.change(value)

    expect(component.value).toBe(value)
    expect(component.valueChange.emit).toHaveBeenCalledWith(value)
    expect(component.validate).toHaveBeenCalled()
  })

  it('should emit inFocus on change', () => {
    spyOn(component.inFocus, 'emit')

    component.change('test')

    expect(component.inFocus.emit).toHaveBeenCalledWith(true)
  })

  it('should validate and set error state correctly', () => {
    component.required = true
    component.value = null

    spyOn(component.valid, 'emit')
    spyOn(component, 'setError')

    component.validate()

    expect(component.valid.emit).toHaveBeenCalledWith(false)
    expect(component.setError).toHaveBeenCalledWith('forms.required')
  })

  it('should clear error state if externalError is present', () => {
    component.externalError = 'error'

    component.validate()

    expect(component.error).toBe(false)
  })

  it('should clear error state if value is present and required', () => {
    component.required = true
    component.value = 'test'

    spyOn(component.valid, 'emit')

    component.validate()

    expect(component.valid.emit).toHaveBeenCalledWith(true)
    expect(component.error).toBe('')
  })

  it('should emit inFocus on blur', () => {
    spyOn(component.inFocus, 'emit')

    component.validate(true)

    expect(component.inFocus.emit).toHaveBeenCalledWith(false)
  })

  it('should set error using translate service', async () => {
    component.useFormErrors = true

    await component.setError('forms.required')

    expect(component.error).toBe('forms.required')
  })

  it('should not set error if useFormErrors is false', async () => {
    component.useFormErrors = false

    await component.setError('forms.required')

    expect(component.error).toBe(false)
  })

  it('should render options correctly', () => {
    component.options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' }
    ]

    fixture.detectChanges()

    const options = fixture.debugElement.queryAll(By.css('option'))
    expect(options.length).toBe(2)
    expect(options[0].nativeElement.textContent).toContain('Option 1')
    expect(options[1].nativeElement.textContent).toContain('Option 2')
  })

  it('should render grouped options correctly', () => {
    component.optionsWithGroups = [
      {
        label: 'Group 1',
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' }
        ]
      }
    ]

    fixture.detectChanges()

    const optgroups = fixture.debugElement.queryAll(By.css('optgroup'))
    expect(optgroups.length).toBe(1)
    expect(optgroups[0].nativeElement.label).toBe('Group 1')

    const options = optgroups[0].queryAll(By.css('option'))
    expect(options.length).toBe(2)
    expect(options[0].nativeElement.textContent).toContain('Option 1')
    expect(options[1].nativeElement.textContent).toContain('Option 2')
  })

  it('should apply custom class', () => {
    component.customClass = 'custom-class'
    fixture.detectChanges()

    const selectElement = fixture.debugElement.query(By.css('.wrapper-all-inside-input'))
    expect(selectElement.nativeElement.classList).toContain('custom-class')
  })

  it('should disable select input', () => {
    component.disabled = true
    fixture.detectChanges()

    const selectElement = fixture.debugElement.query(By.css('select'))
    expect(selectElement.nativeElement.disabled).toBeTrue()
  })

  it('should set readonly attribute', () => {
    component.readonly = true
    fixture.detectChanges()

    const selectElement = fixture.debugElement.query(By.css('select'))
    expect(selectElement.nativeElement.classList).toContain('readonly')
  })

  it('should set required attribute', () => {
    component.required = true
    fixture.detectChanges()

    const selectElement = fixture.debugElement.query(By.css('select'))
    expect(selectElement.properties['required']).toBeTrue()
  })

  it('should show loading state', () => {
    component.loading = true
    fixture.detectChanges()

    const selectElement = fixture.debugElement.query(By.css('select'))
    expect(selectElement.properties['disabled']).toBeTrue()
  })

  it('should display tooltip', () => {
    component.tooltipMessage = 'Tooltip Message'
    fixture.detectChanges()

    const tooltipElement = fixture.debugElement.query(By.css('sq-tooltip')).nativeElement
    expect(tooltipElement).toBeTruthy()
    expect(tooltipElement.getAttribute('ng-reflect-message')).toBe('Tooltip Message')
  })
})