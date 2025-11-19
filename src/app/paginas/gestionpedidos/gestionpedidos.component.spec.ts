import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionPedidosComponent } from './gestionpedidos.component';

describe('GestionPedidosComponent', () => {
  let component: GestionPedidosComponent;
  let fixture: ComponentFixture<GestionPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPedidosComponent] // standalone
    }).compileComponents();

    fixture = TestBed.createComponent(GestionPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe cambiar el estado del pedido', () => {
    const pedido = component.orders[0];
    spyOn(window, 'prompt').and.returnValue('Entregado');

    component.changeOrderStatus(pedido.id);

    expect(pedido.status).toBe('Entregado');
  });

  it('Debe ejecutar contactClient', () => {
    spyOn(window, 'alert');
    component.contactClient('Lucía');
    expect(window.alert).toHaveBeenCalledWith('Contactando al cliente: Lucía');
  });
});
