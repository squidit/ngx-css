import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SqTooltipComponent } from './sq-tooltip.component'
import { By } from '@angular/platform-browser'
import { SqTooltipDirective } from 'src/public-api'

describe('SqTooltipComponent', () => {
  let component: SqTooltipComponent
  let fixture: ComponentFixture<SqTooltipComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SqTooltipComponent, SqTooltipDirective]
    }).compileComponents()

    fixture = TestBed.createComponent(SqTooltipComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display the correct message', () => {
    component.message = 'Test Tooltip Message'
    fixture.detectChanges()
    const tooltipElement = fixture.debugElement.query(By.css('.wrapper-tooltip'))
    expect(tooltipElement.attributes['ng-reflect-content']).toContain('Test Tooltip Message')
  })

  it('should apply the correct color', () => {
    component.color = 'red'
    fixture.detectChanges()
    const tooltipElement = fixture.debugElement.query(By.css('.wrapper-tooltip'))
    expect(tooltipElement.nativeElement.style.color).toBe('red')
  })

  it('should apply the correct font size', () => {
    component.fontSize = '2rem'
    fixture.detectChanges()
    const tooltipElement = fixture.debugElement.query(By.css('.wrapper-tooltip'))
    expect(tooltipElement.nativeElement.style.fontSize).toBe('2rem')
  })

  it('should apply the correct trigger', () => {
    component.trigger = 'click'
    fixture.detectChanges()
    const tooltipElement = fixture.debugElement.query(By.css('.wrapper-tooltip'))
    expect(tooltipElement.nativeElement.getAttribute('ng-reflect-trigger')).toBe('click')
  })
})