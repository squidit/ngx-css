import { TestBed } from '@angular/core/testing';

import { NgxCssService } from './ngx-css.service';

describe('NgxCssService', () => {
  let service: NgxCssService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxCssService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
