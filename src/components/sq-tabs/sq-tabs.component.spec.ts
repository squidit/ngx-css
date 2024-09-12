import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SqTabsComponent } from './sq-tabs.component'
import { SqTabComponent } from './sq-tab/sq-tab.component'
import { UniversalSafePipe } from 'src/public-api'

describe('SqTabsComponent', () => {
  let component: SqTabsComponent
  let fixture: ComponentFixture<SqTabsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SqTabsComponent, UniversalSafePipe]
    }).compileComponents()

    fixture = TestBed.createComponent(SqTabsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize with default values', () => {
    expect(component.customClass).toBe('')
    expect(component.maxWidth).toBe('initial')
    expect(component.margin).toBe('0 auto')
    expect(component.lineStyle).toBe(false)
    expect(component.tabWidth).toBe('')
    expect(component.sm).toBe(true)
    expect(component.hideHtmlForInactives).toBe(false)
  })

  it('should select the first tab if no tab is active', async () => {
    const tab1 = new SqTabComponent()
    const tab2 = new SqTabComponent()
    component.tabs.reset([tab1, tab2])
    fixture.detectChanges()

    await component.ngAfterViewInit()
    expect(tab1.active).toBe(true)
    expect(tab2.active).toBe(false)
  })

  it('should emit tabChange event when a tab is selected', () => {
    const tab = new SqTabComponent()
    spyOn(component.tabChange, 'emit')
    component.selectTab(tab, 0)
    expect(component.tabChange.emit).toHaveBeenCalledWith({ tab, index: 0 })
  })

  it('should hide HTML for inactive tabs if hideHtmlForInactives is true', () => {
    component.hideHtmlForInactives = true
    const tab1 = new SqTabComponent()
    const tab2 = new SqTabComponent()
    component.tabs.reset([tab1, tab2])
    fixture.detectChanges()

    component.selectTab(tab1, 0)
    expect(tab1.hideHtml).toBe(false)
    expect(tab2.hideHtml).toBe(true)
  })

  it('should call whenOpen event when a tab is opened', () => {
    const tab = new SqTabComponent()
    spyOn(tab.whenOpen, 'emit')
    component.selectTab(tab, 0)
    expect(tab.whenOpen.emit).toHaveBeenCalled()
  })
})