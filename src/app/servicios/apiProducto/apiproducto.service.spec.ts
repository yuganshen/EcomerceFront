import { TestBed } from '@angular/core/testing';

import { ApiproductoService } from './apiproducto.service';

describe('ApiproductoService', () => {
  let service: ApiproductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiproductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
