import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarAdminComponent } from '../../componentes/navbaradmin/navbaradmin.component';


interface Pedido {
  id: number;
  client: string;
  product: string;
  status: string;
}

@Component({
  selector: 'app-gestion-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule,NavbarAdminComponent],
  templateUrl: './gestionpedidos.component.html',
  styleUrls: ['./gestionpedidos.component.css']
})
export class GestionPedidosComponent {

  orders: Pedido[] = [
    { id: 101, client: 'Lucía', product: 'Laptop', status: 'Pendiente' },
    { id: 102, client: 'Carlos', product: 'Celular', status: 'Enviado' }
  ];

  changeOrderStatus(id: number) {
    const order = this.orders.find(o => o.id === id);
    if (!order) return;

    const newStatus = prompt('Nuevo estado:', order.status);
    if (newStatus) {
      order.status = newStatus;
    }
  }

  contactClient(name: string) {
    alert(`Contactando al cliente: ${name}`);
  }
}
