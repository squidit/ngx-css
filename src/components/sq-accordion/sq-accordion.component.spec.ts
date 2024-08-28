import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SqAccordionComponent } from './sq-accordion.component'
import { SqCollapseComponent } from './sq-collapse/sq-collapse.component'
import { EventEmitter, QueryList } from '@angular/core'

describe('SqAccordionComponent', () => {
  let component: SqAccordionComponent
  let fixture: ComponentFixture<SqAccordionComponent>
  let mockCollapse: jasmine.SpyObj<SqCollapseComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SqAccordionComponent, SqCollapseComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SqAccordionComponent)
    component = fixture.componentInstance

    mockCollapse = jasmine.createSpyObj('SqCollapseComponent', ['toggleCollapse'], {
      openedEmitter: new EventEmitter(),
      open: false,
    })

    const collapses = new QueryList<SqCollapseComponent>()
    collapses.reset([mockCollapse])
    component.collapses = collapses

    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should open the first collapse if openFirst is true', async () => {
    component.openFirst = true
    component.collapses.reset([mockCollapse])

    await component.ngAfterContentInit()

    expect(mockCollapse.toggleCollapse).toHaveBeenCalled()
  })

  it('should subscribe to collapse openedEmitter', () => {
    component.collapses.reset([mockCollapse])
    component.ngAfterContentInit()

    mockCollapse.openedEmitter.emit()

    expect(mockCollapse.toggleCollapse).toHaveBeenCalled()
  })

  it('should close other collapses if onlyOne is true', () => {
    component.onlyOne = true

    const secondMockCollapse = jasmine.createSpyObj('SqCollapseComponent', ['toggleCollapse'], {
      openedEmitter: new EventEmitter(),
      open: true,
    })

    component.collapses.reset([mockCollapse, secondMockCollapse])

    component.openCollapse(mockCollapse)

    expect(secondMockCollapse.toggleCollapse).toHaveBeenCalled()
    expect(mockCollapse.toggleCollapse).toHaveBeenCalled()
  })

  it('should not close other collapses if onlyOne is false', () => {
    component.onlyOne = false

    const secondMockCollapse = jasmine.createSpyObj('SqCollapseComponent', ['toggleCollapse'], {
      openedEmitter: new EventEmitter(),
      open: true,
    })

    component.collapses.reset([mockCollapse, secondMockCollapse])

    mockCollapse.open = true

    component.openCollapse(secondMockCollapse)

    expect(mockCollapse.toggleCollapse).not.toHaveBeenCalled()
    expect(secondMockCollapse.toggleCollapse).toHaveBeenCalled()
  })

  it('should unsubscribe from all collapses on destroy', () => {
    component.collapses.reset([mockCollapse])
    spyOn(mockCollapse.openedEmitter, 'unsubscribe')

    component.ngOnDestroy()

    expect(mockCollapse.openedEmitter.unsubscribe).toHaveBeenCalled()
  })
})
