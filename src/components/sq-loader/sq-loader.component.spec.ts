import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SqLoaderComponent } from './sq-loader.component'
import { By } from '@angular/platform-browser'

describe('SqLoaderComponent', () => {
  let component: SqLoaderComponent
  let fixture: ComponentFixture<SqLoaderComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SqLoaderComponent],
    })

    fixture = TestBed.createComponent(SqLoaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should have default size set to small', () => {
    const loaderElement = fixture.debugElement.query(By.css('.loader'))
    expect(loaderElement.nativeElement.classList).toContain('small')
  })

  it('should apply custom size when customSize is set', () => {
    component.customSize = '50px'
    fixture.detectChanges()

    const loaderElement = fixture.debugElement.query(By.css('.loader'))
    expect(loaderElement.nativeElement.style.height).toBe('50px')
    expect(loaderElement.nativeElement.style.width).toBe('50px')
  })

  it('should apply custom border size when borderSize is set', () => {
    component.borderSize = '0.3em'
    fixture.detectChanges()

    const loaderElement = fixture.debugElement.query(By.css('.loader'))
    expect(loaderElement.styles['border-width']).toBe('0.3em')
  })

  it('should apply custom color when color is set', () => {
    component.color = 'rgb(255, 153, 0)'
    fixture.detectChanges()

    const loaderElement = fixture.debugElement.query(By.css('.loader'))
    expect(loaderElement.nativeElement.style['border-color']).toBe('rgb(255, 153, 0)')
  })

  it('should apply custom CSS class when customClass is set', () => {
    component.customClass = 'custom-spinner'
    fixture.detectChanges()

    const loaderElement = fixture.debugElement.query(By.css('.loader'))
    expect(loaderElement.nativeElement.classList).toContain('custom-spinner')
  })

  it('should apply the correct size class when size is set', () => {
    component.size = 'bigger'
    fixture.detectChanges()

    const loaderElement = fixture.debugElement.query(By.css('.loader'))
    expect(loaderElement.nativeElement.classList).toContain('bigger')

    component.size = 'big'
    fixture.detectChanges()

    expect(loaderElement.nativeElement.classList).toContain('big')
  })

  it('should apply default styles if no inputs are set', () => {
    const loaderElement = fixture.debugElement.query(By.css('.loader'))
    expect(loaderElement.styles['border-width']).toBe('0.2em')
    expect(loaderElement.styles['border-color']).toBe('var(--primary_color)')
  })

  it('should display the visually hidden text "Loading..."', () => {
    const spanElement = fixture.debugElement.query(By.css('.visually-hidden'))
    expect(spanElement.nativeElement.textContent).toBe('Loading...')
  })
})
