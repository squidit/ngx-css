import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { ElementRef, SimpleChange } from '@angular/core'
import { By } from '@angular/platform-browser'
import { NavigationEnd, Router } from '@angular/router'
import { SqModalComponent } from './sq-modal.component'
import { DOCUMENT } from '@angular/common'
import { GetWindow } from '../../helpers/window.helper'
import { Observable, Subscription } from 'rxjs'
import { SqClickOutsideDirective } from 'src/public-api'

const mockRouter = {
  events: new Observable(observer => {
    observer.next(new NavigationEnd(0, 'http://localhost:4200', 'http://localhost:4200'))
    observer.complete()
  })
}

describe('SqModalComponent', () => {
  let component: SqModalComponent
  let fixture: ComponentFixture<SqModalComponent>
  let mockDocument: Document
  let mockGetWindow: jasmine.SpyObj<GetWindow>

  beforeEach(async () => {
    mockGetWindow = jasmine.createSpyObj('GetWindow', ['window', 'href', 'touch', 'URL'])
    mockGetWindow.href.and.returnValue('http://localhost')

    TestBed.configureTestingModule({
      declarations: [SqModalComponent, SqClickOutsideDirective],
      providers: [
        { provide: DOCUMENT, useValue: document },
        { provide: Router, useValue: mockRouter },
        { provide: GetWindow, useValue: mockGetWindow }
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SqModalComponent)
    component = fixture.componentInstance
    mockDocument = TestBed.inject(DOCUMENT)
    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should append modal-backdrop when modal is opened and remove it when closed', fakeAsync(() => {
    const body = mockDocument.getElementsByTagName('body')[0]
    spyOn(body, 'appendChild').and.callThrough()

    component.open = true
    component.ngOnChanges({ open: new SimpleChange(false, Promise, true) })
    fixture.detectChanges()
    tick(10)

    const backdrop = mockDocument.getElementById('modal-backdrop')
    expect(backdrop).toBeTruthy()

    component.open = false
    component.ngOnChanges({ open: new SimpleChange(false, Promise, true) })
    fixture.detectChanges()
    tick(10)

    expect(backdrop?.parentNode).toBeNull()
  }))

  it('should emit modalClose when the close button is clicked', () => {
    spyOn(component.modalClose, 'emit')

    component.buttonClose = true
    component.open = true
    fixture.detectChanges()

    const closeButton = fixture.debugElement.query(By.css('.button-close'))
    closeButton.triggerEventHandler('click', null)

    expect(component.modalClose.emit).toHaveBeenCalled()
  })

  it('should add modal to the body when open is true', fakeAsync(() => {
    const body = mockDocument.getElementsByTagName('body')[0]
    spyOn(body, 'appendChild').and.callThrough()

    component.open = true
    component.ngOnChanges({ open: new SimpleChange(false, Promise, true) })
    fixture.detectChanges()
    tick(10)

    expect(body.appendChild).toHaveBeenCalledWith(component.modal?.nativeElement)
  }))

  it('should remove modal from body when open is false', () => {
    component.open = true
    fixture.detectChanges()

    spyOn(component, 'removeModalFromBody').and.callThrough()

    component.open = false
    component.ngOnChanges({ open: new SimpleChange(false, Promise, true) })
    fixture.detectChanges()

    expect(component.removeModalFromBody).toHaveBeenCalled()
  })

  it('should apply custom header, body, and footer background styles', () => {
    component.headerBackgroundColor = '#ff0000'
    component.bodyBackgroundColor = '#00ff00'
    component.footerBackgroundColor = '#0000ff'
    component.open = true
    fixture.detectChanges()

    const header = fixture.debugElement.query(By.css('.modal-header'))
    const body = fixture.debugElement.query(By.css('.modal-body'))
    const footer = fixture.debugElement.query(By.css('.modal-footer'))

    expect(header.nativeElement.style.background).toBe('rgb(255, 0, 0)')
    expect(body.nativeElement.style.background).toBe('rgb(0, 255, 0)')
  })

  it('should apply the correct modal size class', () => {
    component.modalSize = 'lg'
    fixture.detectChanges()

    const modalDialog = fixture.debugElement.query(By.css('.modal-dialog'))
    expect(modalDialog.nativeElement.classList).toContain('modal-lg')

    component.modalSize = 'sm'
    fixture.detectChanges()

    expect(modalDialog.nativeElement.classList).toContain('modal-sm')
  })

  it('should emit leftPress when left arrow key is pressed', fakeAsync(() => {
    spyOn(component.leftPress, 'emit')
    component.open = true
    component.ngOnChanges({ open: new SimpleChange(false, Promise, true) })
    fixture.detectChanges()
    tick(10)

    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
    component.onKeydown(event)

    expect(component.leftPress.emit).toHaveBeenCalled()
  }))

  it('should emit rightPress when right arrow key is pressed', fakeAsync(() => {
    spyOn(component.rightPress, 'emit')
    component.open = true
    component.ngOnChanges({ open: new SimpleChange(false, Promise, true) })
    fixture.detectChanges()
    tick(10)

    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
    component.onKeydown(event)

    expect(component.rightPress.emit).toHaveBeenCalled()
  }))

  it('should emit modalClose when Escape key is pressed', fakeAsync(() => {
    spyOn(component.modalClose, 'emit')
    component.open = true
    component.ngOnChanges({ open: new SimpleChange(false, Promise, true) })
    fixture.detectChanges()
    tick(10)

    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    component.onKeydown(event)

    expect(component.modalClose.emit).toHaveBeenCalled()
  }))

  it('should clean up on destroy', () => {
    const subscription = new Subscription()
    component.routerObservable = subscription

    spyOn(subscription, 'unsubscribe')
    component.ngOnDestroy()

    expect(subscription.unsubscribe).toHaveBeenCalled()
  })
})
