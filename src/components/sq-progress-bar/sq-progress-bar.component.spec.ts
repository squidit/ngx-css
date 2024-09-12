import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SqProgressBarComponent } from './sq-progress-bar.component';
import { By } from '@angular/platform-browser';

describe('SqProgressBarComponent', () => {
  let component: SqProgressBarComponent;
  let fixture: ComponentFixture<SqProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SqProgressBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SqProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default values correctly', () => {
    expect(component.color).toBe('black');
    expect(component.hasLabel).toBe(false);
    expect(component.value).toBe(0);
    expect(component.height).toBe('1rem');
    expect(component.striped).toBe(true);
    expect(component.animated).toBe(false);
  });

  it('should apply the correct styles based on inputs', () => {
    component.color = 'red';
    component.height = '2rem';
    component.value = 75;
    fixture.detectChanges();

    const progressBarElement = fixture.debugElement.query(By.css('.progress-bar')).nativeElement;
    console.log(progressBarElement)

    expect(progressBarElement.classList).toContain('background-red');
    expect(progressBarElement.style.height).toBe('2rem');
  });

  it('should round the value correctly using useMemo', () => {
    const roundedValue = component.roundValue('49.8');
    expect(roundedValue).toBe(50);
  });

  it('should show the label if hasLabel is true', () => {
    component.hasLabel = true;
    component.value = 42;
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('.progress-bar'));
    console.log(labelElement)
    expect(labelElement).toBeTruthy();
    expect(labelElement.nativeElement.textContent.trim()).toBe('42%');
  });

  it('should not show the label if hasLabel is false', () => {
    component.hasLabel = false;
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('.progress-bar-label'));
    expect(labelElement).toBeFalsy();
  });

  it('should apply the striped class if striped is true', () => {
    component.striped = true;
    fixture.detectChanges();

    const progressBarElement = fixture.debugElement.query(By.css('.progress-bar')).nativeElement;
    expect(progressBarElement.classList).toContain('background-dashed');
  });

  it('should not apply the striped class if striped is false', () => {
    component.striped = false;
    fixture.detectChanges();

    const progressBarElement = fixture.debugElement.query(By.css('.progress-bar')).nativeElement;
    expect(progressBarElement.classList).not.toContain('progress-bar-striped');
  });

  it('should apply the animated class if animated is true', () => {
    component.animated = true;
    fixture.detectChanges();

    const progressBarElement = fixture.debugElement.query(By.css('.progress-bar')).nativeElement;
    expect(progressBarElement.classList).toContain('animate-bar');
  });

  it('should not apply the animated class if animated is false', () => {
    component.animated = false;
    fixture.detectChanges();

    const progressBarElement = fixture.debugElement.query(By.css('.progress-bar')).nativeElement;
    expect(progressBarElement.classList).not.toContain('progress-bar-animated');
  });
});
