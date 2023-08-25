import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrcComponent } from './src.component';

describe('SrcComponent', () => {
  let component: SrcComponent;
  let fixture: ComponentFixture<SrcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SrcComponent]
    });
    fixture = TestBed.createComponent(SrcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
