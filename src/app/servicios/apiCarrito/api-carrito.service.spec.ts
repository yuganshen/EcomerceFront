import { TestBed } from '@angular/core/testing';

import { ApiCarritoService } from './api-carrito.service';

describe('ApiCarritoService', () => {
  let service: ApiCarritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiCarritoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
