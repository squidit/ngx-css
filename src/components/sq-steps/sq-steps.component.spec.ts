import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { SqStepsComponent } from './sq-steps.component'
import { Step } from '../../interfaces/step.interface'
import { SqTooltipComponent, SqTooltipDirective } from 'src/public-api'

describe('SqStepsComponent', () => {
  let component: SqStepsComponent
  let fixture: ComponentFixture<SqStepsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SqStepsComponent, SqTooltipComponent, SqTooltipDirective]
    }).compileComponents()

    fixture = TestBed.createComponent(SqStepsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render steps', () => {
    const steps: Step[] = [
      { tip: 'Step 1', status: 'completed' },
      { tip: 'Step 2', status: 'active' },
      { tip: 'Step 3', status: 'disabled' },
    ]
    component.steps = steps
    fixture.detectChanges()

    const stepElements = fixture.debugElement.queryAll(By.css('li'))
    expect(stepElements.length).toBe(steps.length)
  })

  it('should apply active class to the active step', () => {
    const steps: Step[] = [
      { tip: 'Step 1', status: 'completed' },
      { tip: 'Step 2', status: 'active' },
      { tip: 'Step 3', status: 'disabled' },
    ]
    component.steps = steps
    component.active = 1
    fixture.detectChanges()

    const activeStepElement = fixture.debugElement.query(By.css('li.active span'))
    expect(activeStepElement).toBeTruthy()
    expect(activeStepElement.attributes['ng-reflect-content']).toContain('Step 2')
  })

  it('should emit event when step is clicked', () => {
    spyOn(component.emitClick, 'emit')

    const steps: Step[] = [
      { tip: 'Step 1', status: 'completed' },
      { tip: 'Step 2', status: 'active' },
      { tip: 'Step 3', status: 'disabled' },
    ]
    component.steps = steps
    component.click = true
    fixture.detectChanges()

    const stepElements = fixture.debugElement.queryAll(By.css('span'))
    stepElements[1].nativeElement.click()

    expect(component.emitClick.emit).toHaveBeenCalledWith({ step: steps[1], i: 1 })
  })

  it('should not emit event when click is disabled', () => {
    spyOn(component.emitClick, 'emit')

    const steps: Step[] = [
      { tip: 'Step 1', status: 'completed' },
      { tip: 'Step 2', status: 'active' },
      { tip: 'Step 3', status: 'disabled' },
    ]
    component.steps = steps
    component.click = false
    fixture.detectChanges()

    const stepElements = fixture.debugElement.queryAll(By.css('li'))
    stepElements[1].nativeElement.click()

    expect(component.emitClick.emit).not.toHaveBeenCalled()
  })

  it('should have default color', () => {
    expect(component.color).toBe('var(--primary_color)')
  })

  it('should set custom color', () => {
    component.color = 'red'
    fixture.detectChanges()
    expect(component.color).toBe('red')
  })
})