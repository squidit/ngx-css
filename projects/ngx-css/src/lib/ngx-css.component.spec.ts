import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCssComponent } from './ngx-css.component';

describe('NgxCssComponent', () => {
  let component: NgxCssComponent;
  let fixture: ComponentFixture<NgxCssComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgxCssComponent]
    });
    fixture = TestBed.createComponent(NgxCssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
