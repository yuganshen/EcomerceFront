import { TestBed } from '@angular/core/testing';

import { ApiPedidoService } from './api-pedido.service';

describe('ApiPedidoService', () => {
  let service: ApiPedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPedidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
