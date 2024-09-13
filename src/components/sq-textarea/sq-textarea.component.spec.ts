import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { TranslateService, TranslateModule } from '@ngx-translate/core'
import { ValidatorHelper } from '../../helpers/validator.helper'
import { SqTextAreaComponent } from './sq-textarea.component'
import { ElementRef } from '@angular/core'

describe('SqTextAreaComponent', () => {
  let component: SqTextAreaComponent
  let fixture: ComponentFixture<SqTextAreaComponent>
  let elementRef: ElementRef

  beforeEach(async () => {
    elementRef = new ElementRef(document.createElement('textarea'))

    await TestBed.configureTestingModule({
      declarations: [SqTextAreaComponent],
      imports: [FormsModule, TranslateModule.forRoot()],
      providers: [
        ValidatorHelper,
        { provide: ElementRef, useValue: elementRef },
        TranslateService
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(SqTextAreaComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should emit valueChange event on change', (done) => {
    const newValue = 'new value'
    component.valueChange.subscribe((value) => {
      expect(value).toBe(newValue)
      done()
    })
    component.change(newValue)
  })

  it('should emit keyPressDown event on keyDown', () => {
    spyOn(component.keyPressDown, 'emit')
    const event = new KeyboardEvent('keydown')
    component.keyDown(event)
    expect(component.keyPressDown.emit).toHaveBeenCalledWith(event)
  })

  it('should emit keyPressUp event on keyUp', () => {
    spyOn(component.keyPressUp, 'emit')
    const event = new KeyboardEvent('keyup')
    component.keyUp(event)
    expect(component.keyPressUp.emit).toHaveBeenCalledWith(event)
  })

  it('should emit inFocus event on change', () => {
    spyOn(component.inFocus, 'emit')
    component.change('test')
    expect(component.inFocus.emit).toHaveBeenCalledWith(true)
  })

  it('should validate required field', async () => {
    component.required = true
    component.value = ''
    spyOn(component.valid, 'emit')
    await component.validate()
    expect(component.valid.emit).toHaveBeenCalledWith(false)
    expect(component.error).toBe('forms.required')
  })

  it('should validate with external error', async () => {
    component.externalError = 'External error'
    await component.validate()
    expect(component.error).toBe(false)
  })

  it('should set error using translate service', async () => {
    spyOn(component.translate, 'instant').and.returnValue('Translated error')
    component.useFormErrors = true
    await component.setError('error.key')
    expect(component.error).toBe('Translated error')
  })

  it('should not set error if useFormErrors is false', async () => {
    component.useFormErrors = false
    await component.setError('error.key')
    expect(component.error).toBe(false)
  })
})