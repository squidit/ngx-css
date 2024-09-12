import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SqOverlayComponent } from './sq-overlay.component';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { GetWindow } from '../../helpers/window.helper';
import { Observable, of } from 'rxjs';
import { ElementRef } from '@angular/core';
import { SqClickOutsideDirective } from 'src/public-api';

const mockRouter = {
  events: new Observable(observer => {
    observer.next(new NavigationEnd(0, 'http://localhost:4200', 'http://localhost:4200'))
    observer.complete()
  })
}

describe('SqOverlayComponent', () => {
  let component: SqOverlayComponent;
  let fixture: ComponentFixture<SqOverlayComponent>;
  let mockDocument: Document;
  let mockGetWindow: jasmine.SpyObj<GetWindow>;


  beforeEach(async () => {
    mockDocument = document;
    mockGetWindow = jasmine.createSpyObj('GetWindow', ['window', 'href']);

    mockGetWindow.href.and.returnValue('http://localhost');

    await TestBed.configureTestingModule({
      declarations: [SqOverlayComponent, SqClickOutsideDirective],
      providers: [
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: Router, useValue: mockRouter },
        { provide: GetWindow, useValue: mockGetWindow }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SqOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should append modal to body when open is true', async () => {
    spyOn(mockDocument.body, 'appendChild').and.callThrough();
    spyOn(mockDocument.body.classList, 'add').and.callThrough();

    component.open = true;
    await component.ngOnChanges({ open: { currentValue: true, previousValue: false, firstChange: true, isFirstChange: () => true } });

    expect(mockDocument.body.appendChild).toHaveBeenCalled();
    expect(mockDocument.body.classList.add).toHaveBeenCalledWith('block');
  });

  it('should remove modal from body when open is false', () => {
    spyOn(mockDocument.body, 'removeChild').and.callThrough();
    spyOn(mockDocument.body.classList, 'remove').and.callThrough();
    spyOn(component.overlayClose, 'emit');

    component.open = false;
    component.removeOverlayFromBody();

    expect(mockDocument.body.removeChild).toHaveBeenCalled();
    expect(mockDocument.body.classList.remove).toHaveBeenCalledWith('block');
    expect(component.overlayClose.emit).toHaveBeenCalled();
  });

  it('should emit overlayClose event on Escape key press', () => {
    spyOn(component.overlayClose, 'emit');

    const keyboardEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    component.open = true;
    component.onKeydown(keyboardEvent);

    expect(component.overlayClose.emit).toHaveBeenCalled();
  });

  it('should emit leftPress event on ArrowLeft key press', () => {
    spyOn(component.leftPress, 'emit');

    const keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    component.open = true;
    component.onKeydown(keyboardEvent);

    expect(component.leftPress.emit).toHaveBeenCalled();
  });

  it('should emit rightPress event on ArrowRight key press', () => {
    spyOn(component.rightPress, 'emit');

    const keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    component.open = true;
    component.onKeydown(keyboardEvent);

    expect(component.rightPress.emit).toHaveBeenCalled();
  });

  it('should remove overlay from body on route change', async () => {
    spyOn(component, 'removeOverlayFromBody').and.callThrough();
    const event = new NavigationStart(1, '/new-url');
    mockRouter.events = of(event);

    component.observeRouter();
    fixture.detectChanges();

    expect(component.removeOverlayFromBody).toHaveBeenCalled();
  });

  it('should call doCssWidth when width changes and modal is open', () => {
    spyOn(component, 'doCssWidth');

    component.open = true;

    const changes = {
      width: {
        currentValue: '500px',
        previousValue: '400px',
        firstChange: false,
        isFirstChange: () => false
      }
    };

    component.ngOnChanges(changes);

    expect(component.doCssWidth).toHaveBeenCalled();
  });

  it('should not call doCssWidth when modal is closed', () => {
    spyOn(component, 'doCssWidth');

    component.open = false;

    const changes = {
      width: {
        currentValue: '500px',
        previousValue: '400px',
        firstChange: false,
        isFirstChange: () => false
      }
    };

    component.ngOnChanges(changes);

    expect(component.doCssWidth).not.toHaveBeenCalled();
  })
});
