import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { SqTagComponent } from './sq-tag.component'
import { ColorsHelper } from '../../helpers/colors.helper'

describe('SqTagComponent', () => {
  let component: SqTagComponent
  let fixture: ComponentFixture<SqTagComponent>
  let colorsHelper: jasmine.SpyObj<ColorsHelper>

  beforeEach(async () => {
    colorsHelper = jasmine.createSpyObj('ColorsHelper', ['getCssVariableValue'])
    colorsHelper.getCssVariableValue.and.callFake((color: string) => color)
    await TestBed.configureTestingModule({
      declarations: [SqTagComponent],
      providers: [{ provide: ColorsHelper, useValue: colorsHelper }]
    }).compileComponents()

    fixture = TestBed.createComponent(SqTagComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should emit click event when clicked and not readonly or disabled', () => {
    spyOn(component.emitClick, 'emit')
    component.readonly = false
    component.disabled = false
    fixture.detectChanges()

    const tagElement = fixture.debugElement.query(By.css('.tag-box'))
    tagElement.triggerEventHandler('click', null)

    expect(component.emitClick.emit).toHaveBeenCalled()
  })

  it('should not emit click event when readonly', () => {
    spyOn(component.emitClick, 'emit')
    component.readonly = true
    fixture.detectChanges()

    const tagElement = fixture.debugElement.query(By.css('.tag-box'))
    tagElement.triggerEventHandler('click', null)

    expect(component.emitClick.emit).not.toHaveBeenCalled()
  })

  it('should not emit click event when disabled', () => {
    spyOn(component.emitClick, 'emit')
    component.disabled = true
    fixture.detectChanges()

    const tagElement = fixture.debugElement.query(By.css('.tag-box'))
    tagElement.triggerEventHandler('click', null)

    expect(component.emitClick.emit).not.toHaveBeenCalled()
  })

  it('should validate preset colors', () => {
    component.color = 'preset-color'
    expect(component.validatePresetColors()).toBeTrue()
  })
})