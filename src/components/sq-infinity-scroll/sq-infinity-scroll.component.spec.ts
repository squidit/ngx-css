import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ElementRef } from '@angular/core'
import { By } from '@angular/platform-browser'
import { DOCUMENT } from '@angular/common'
import { SqInfinityComponent } from './sq-infinity-scroll.component'
import { GetWindow } from '../../helpers/window.helper'
import { DebugElement } from '@angular/core'
import { SqLoaderComponent } from 'src/public-api'

describe('SqInfinityComponent', () => {
  let component: SqInfinityComponent
  let fixture: ComponentFixture<SqInfinityComponent>
  let mockDocument: Document
  let mockGetWindow: jasmine.SpyObj<GetWindow>
  let scrollElement: DebugElement

  beforeEach(async () => {
    mockGetWindow = jasmine.createSpyObj('GetWindow', ['window', 'href', 'touch'])

    await TestBed.configureTestingModule({
      declarations: [SqInfinityComponent, SqLoaderComponent],
      providers: [
        { provide: DOCUMENT, useValue: document },
        { provide: GetWindow, useValue: mockGetWindow }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(SqInfinityComponent)
    component = fixture.componentInstance
    mockDocument = TestBed.inject(DOCUMENT)
    scrollElement = fixture.debugElement.query(By.css('.scroll'))
    fixture.detectChanges()

    component.scrollElement = new ElementRef({ offsetHeight: 100, offsetTop: 0 })
    component.length = 10
    component.hasMore = true
    component.loading = false
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should set elementToScroll as window if elementToScrollId is not provided', () => {
    mockGetWindow.window.and.returnValue(window)
    component.ngAfterViewInit()
    expect(component.elementToScroll).toBe(window)
  })

  it('should set elementToScroll to the element with the given elementToScrollId', () => {
    const mockElement = document.createElement('div')
    spyOn(mockDocument, 'getElementById').and.returnValue(mockElement)

    component.elementToScrollId = 'custom-scroll-id'
    component.ngAfterViewInit()

    expect(mockDocument.getElementById).toHaveBeenCalledWith('custom-scroll-id')
    expect(component.elementToScroll).toBe(mockElement)
  })

  it('should update the elementToScroll if it changes after content check', () => {
    const initialElement = document.createElement('div')
    const updatedElement = document.createElement('div')

    spyOn(mockDocument, 'getElementById').and.returnValues(initialElement, updatedElement)

    component.elementToScrollId = 'custom-scroll-id'
    component.ngAfterViewInit()

    expect(component.elementToScroll).toEqual(initialElement)

    component.ngAfterContentChecked()

    expect(component.elementToScroll).toEqual(updatedElement)
  })

  it('should remove the scroll event listener when the component is destroyed', () => {
    const elementWithListener = document.createElement('div')
    spyOn(elementWithListener, 'removeEventListener')

    component.elementToScroll = elementWithListener
    component.ngOnDestroy()

    expect(elementWithListener.removeEventListener).toHaveBeenCalledWith('scroll', component.onScroll, false)
  })

  it('should emit scrolledEmitter if scrolled to the bottom and has more items', () => {
    const elementWithListener = document.createElement('div')
    elementWithListener.id = 'custom-scroll-id'

    component.elementToScrollId = 'custom-scroll-id'
    component.elementToScroll = elementWithListener

    spyOn(component.scrolledEmitter, 'emit')

    component.onScroll()

    expect(component.scrolledEmitter.emit).toHaveBeenCalled()
  })

  it('should not emit scrolledEmitter if already loading', () => {
    component.loading = true

    spyOn(component.scrolledEmitter, 'emit')

    component.onScroll()

    expect(component.scrolledEmitter.emit).not.toHaveBeenCalled()
  })

  it('should not emit scrolledEmitter if there are no more items', () => {
    component.hasMore = false

    spyOn(component.scrolledEmitter, 'emit')

    component.onScroll()

    expect(component.scrolledEmitter.emit).not.toHaveBeenCalled()
  })

  it('should display the loader when loading is true', () => {
    component.loading = true
    fixture.detectChanges()

    const loaderElement = fixture.debugElement.query(By.css('sq-loader'))

    expect(loaderElement).toBeTruthy()
  })

  it('should not display the loader when loading is false', () => {
    component.loading = false
    fixture.detectChanges()

    const loaderElement = fixture.debugElement.query(By.css('sq-loader'))
    expect(loaderElement).toBeFalsy()
  })

  it('should display the end message when hasMore is false and endMessage is provided', () => {
    component.hasMore = false
    component.endMessage = 'No more items to load'
    fixture.detectChanges()

    const messageElement = fixture.debugElement.query(By.css('.wrapper-message'))
    expect(messageElement).toBeTruthy()
    expect(messageElement.nativeElement.textContent.trim()).toBe('No more items to load')
  })

  it('should not display the end message when hasMore is true', () => {
    component.hasMore = true
    fixture.detectChanges()

    const messageElement = fixture.debugElement.query(By.css('.wrapper-message'))
    expect(messageElement).toBeFalsy()
  })
})
