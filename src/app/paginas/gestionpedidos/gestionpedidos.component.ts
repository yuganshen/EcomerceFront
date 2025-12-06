import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarAdminComponent } from '../../componentes/navbaradmin/navbaradmin.component';
import { ApiPedidoService } from '../../servicios/apiPedido/api-pedido.service';


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
/*
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
  }*/


  pedidos: any[]=[];

  constructor(private api: ApiPedidoService) {}
  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.api.obtenerPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        console.log('Productos cargados:', data);
      },
      error: (err) => {
        console.error('Error al listar productos:', err);
      }
    });
  }

  cambiarEstado(pedido: any) {
  this.api.cambiarEstadoPedido(pedido.idPedido).subscribe({
    next: (data) => {
      pedido.estado = data.estado; // Actualiza el estado localmente
      console.log('Estado cambiado:', data);
    },
    error: (err) => {
      console.error('Error al cambiar estado:', err);
    }
  });
}

  
}
