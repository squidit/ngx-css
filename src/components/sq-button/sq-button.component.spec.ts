import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { SqButtonComponent } from './sq-button.component'
import { SqLoaderComponent } from 'src/public-api'

describe('SqButtonComponent', () => {
  let component: SqButtonComponent
  let fixture: ComponentFixture<SqButtonComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SqButtonComponent, SqLoaderComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(SqButtonComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render the button with default type "button"', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'))
    expect(buttonElement.attributes['type']).toBe('button')
  })

  it('should apply the color input to the button', () => {
    component.color = 'secondary'
    fixture.detectChanges()
    const buttonElement = fixture.debugElement.query(By.css('button'))
    expect(buttonElement.classes['button-secondary']).toBeTrue()
  })

  it('should emit click event when button is clicked and not loading or disabled', () => {
    spyOn(component.emitClick, 'emit')
    component.loading = false
    component.disabled = false
    fixture.detectChanges()

    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement
    buttonElement.click()

    expect(component.emitClick.emit).toHaveBeenCalled()
  })

  it('should not emit click event when button is loading', () => {
    spyOn(component.emitClick, 'emit')
    component.loading = true
    fixture.detectChanges()

    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement
    buttonElement.click()

    expect(component.emitClick.emit).not.toHaveBeenCalled()
  })

  it('should not emit click event when button is disabled', () => {
    spyOn(component.emitClick, 'emit')
    component.disabled = true
    fixture.detectChanges()

    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement
    buttonElement.click()

    expect(component.emitClick.emit).not.toHaveBeenCalled()
  })

  it('should set hover to true on mouseover', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'))
    buttonElement.triggerEventHandler('mouseover', null)
    fixture.detectChanges()

    expect(component.hover).toBeTrue()
  })

  it('should set hover to false on mouseleave', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'))
    buttonElement.triggerEventHandler('mouseleave', null)
    fixture.detectChanges()

    expect(component.hover).toBeFalse()
  })

  it('should apply the correct CSS classes based on input properties', () => {
    component.disabled = true
    component.loading = true
    component.block = true
    component.noPadding = true
    component.buttonAsLink = true
    component.noUnderline = true
    component.invertedHover = true
    fixture.detectChanges()

    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement
    expect(buttonElement.classList).toContain('disabled')
    expect(buttonElement.classList).toContain('loading')
    expect(buttonElement.classList).toContain('block')
    expect(buttonElement.classList).toContain('p-0')
    expect(buttonElement.classList).toContain('button-as-link')
    expect(buttonElement.classList).toContain('no-underline')
    expect(buttonElement.classList).toContain('inverted')
  })

  it('should apply styles correctly based on input properties', () => {
    component.fontSize = '16px'
    component.textColor = 'rgb(255, 0, 0)'
    component.color = 'rgb(0, 255, 0)'
    component.borderColor = 'rgb(0, 0, 255)'
    component.borderStyle = 'solid'
    component.borderRadius = '5px'
    component.borderWidth = '2px'
    component.boxShadow = 'rgb(0, 0, 0) 2px 2px 5px'
    component.width = '100px'
    component.textTransform = 'uppercase'
    fixture.detectChanges()

    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement
    expect(buttonElement.style.fontSize).toBe('16px')
    expect(buttonElement.style.color).toBe(component.doHoverAction('text'))
    expect(buttonElement.style.backgroundColor).toBe(component.doHoverAction('background'))
    expect(buttonElement.style.borderColor).toBe(component.doHoverAction('border'))
    expect(buttonElement.style.borderStyle).toBe('solid')
    expect(buttonElement.style.borderRadius).toBe('5px')
    expect(buttonElement.style.borderWidth).toBe('2px')
    expect(buttonElement.style.boxShadow).toBe('rgb(0, 0, 0) 2px 2px 5px')
    expect(buttonElement.style.width).toBe('100px')
    expect(buttonElement.style.textTransform).toBe('uppercase')
  })

  it('should return the correct hover text color when inverted hover is enabled', () => {
    component.invertedHover = true
    component.color = '#000000'
    expect(component.setHoverText()).toBe(component.setHover(component.color))
  })

  it('should have the loading indicator when loading is true', () => {
    component.loading = true
    fixture.detectChanges()
    const loaderElement = fixture.debugElement.query(By.css('sq-loader'))
    expect(loaderElement).not.toBeNull()
  })

  it('should hide button content when loading and hideOnLoading are true', () => {
    component.loading = true
    component.hideOnLoading = true
    fixture.detectChanges()
    const buttonContent = fixture.debugElement.query(By.css('ng-content'))
    expect(buttonContent).toBeNull()
  })
})
