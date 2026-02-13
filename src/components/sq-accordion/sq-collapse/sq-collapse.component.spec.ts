import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SqCollapseComponent } from './sq-collapse.component';
import { By } from '@angular/platform-browser';
import { SqLoaderComponent } from 'src/public-api';
import { ElementRef } from '@angular/core';

describe('SqCollapseComponent', () => {
    let component: SqCollapseComponent;
    let fixture: ComponentFixture<SqCollapseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SqCollapseComponent, SqLoaderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SqCollapseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should have initial values set correctly', () => {
        expect(component.open).toBeFalse();
        expect(component.loading).toBeUndefined();
        expect(component.disabled).toBeUndefined();
        expect(component.color).toBe('');
        expect(component.colorIcons).toBe('');
        expect(component.colorBackgroundIcon).toBe('');
        expect(component.fontSizeIcon).toBeUndefined();
        expect(component.heightIcon).toBeUndefined();
        expect(component.class).toBe('');
        expect(component.noPadding).toBeFalse();
        expect(component.opening).toBeFalse();
        expect(component.hoverHeader).toBeFalse();
        expect(component.hoverIcon).toBeFalse();
        expect(component.timeout).toBeUndefined();
    });

    it('should have the correct class based on input', () => {
        component.class = 'test-class';
        fixture.detectChanges();
        const divElement = fixture.debugElement.query(By.css('.wrapper-collapse'));
        expect(divElement.classes['test-class']).toBeTrue();
    });

    it('should change background-color on hover', () => {
        component.color = 'red';
        component.setHover = jasmine.createSpy('setHover').and.returnValue('blue');
        fixture.detectChanges();

        const headerElement = fixture.debugElement.query(By.css('header'));
        headerElement.triggerEventHandler('mouseover', null);
        fixture.detectChanges();

        expect(headerElement.nativeElement.style.backgroundColor).toBe('blue');

        headerElement.triggerEventHandler('mouseleave', null);
        fixture.detectChanges();

        expect(headerElement.nativeElement.style.backgroundColor).toBe('red');
    });

    it('should emit event with correct parameters', () => {
        spyOn(component.openedEmitter, 'emit');
        const element = document.createElement('div');
        component.emit(element);
        expect(component.openedEmitter.emit).toHaveBeenCalledWith({
            open: !component.open,
            element: element,
        });
    });

    it('should not toggle collapse if disabled, loading or opening is true', () => {
        component.disabled = true;
        component.toggleCollapse();
        expect(component.open).toBeFalse();

        component.disabled = false;
        component.loading = true;
        component.toggleCollapse();
        expect(component.open).toBeFalse();

        component.loading = false;
        component.opening = 'some value';
        component.toggleCollapse();
        expect(component.open).toBeFalse();
    });

    it('should toggle collapse correctly when all conditions are met', fakeAsync(() => {
        component.wrapper = {
            nativeElement: {
                clientHeight: 100
            }
        } as ElementRef;

        component.toggleCollapse();
        expect(component.opening).toBe('100px');

        tick(500);
        expect(component.opening).toBeFalse();
        expect(component.open).toBeTrue();

        component.toggleCollapse();
        expect(component.opening).toBe('100px');

        tick(500);
        expect(component.opening).toBeFalse();
        expect(component.open).toBeFalse();
    }));

    it('should display loader when loading is true', () => {
        component.loading = true;
        fixture.detectChanges();
        const loaderElement = fixture.debugElement.query(By.css('sq-loader'));
        expect(loaderElement).toBeTruthy();
    });

    it('should apply the correct classes based on inputs', () => {
        component.disabled = true;
        component.loading = true;
        component.noPadding = true;
        component.open = true;
        fixture.detectChanges();

        const headerElement = fixture.debugElement.query(By.css('header'));
        expect(headerElement.classes['disabled']).toBeTrue();
        expect(headerElement.classes['loading']).toBeTrue();
        expect(headerElement.classes['p-0']).toBeTrue();
        expect(headerElement.classes['opened']).toBeTrue();
    });
});
