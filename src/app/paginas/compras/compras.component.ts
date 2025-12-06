import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { FooterComponent } from '../../componentes/footer/footer.component';
import { RouterLink } from '@angular/router';
import { ApiPedidosService, Pedido } from '../../servicios/apiPedidos/api-pedidos.service';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink, CommonModule],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent implements OnInit {
  pedidos: Pedido[] = [];
  cargando = true;
  errorMsg = '';
  
  // Variables del modal
  mostrarModal = false;
  pedidoAncancelar: Pedido | null = null;
  cancelandoPedido = false;

  constructor(private pedidosService: ApiPedidosService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  /**
   * Cargar los pedidos del usuario
   */
  cargarPedidos(): void {
    this.cargando = true;
    this.errorMsg = '';
    
    this.pedidosService.obtenerPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar pedidos:', error);
        this.errorMsg = 'No se pudieron cargar los pedidos. Por favor intenta más tarde.';
        this.cargando = false;
      }
    });
  }

  /**
   * Abrir modal de cancelación
   */
  abrirModalCancelar(pedido: Pedido): void {
    this.pedidoAncancelar = pedido;
    this.mostrarModal = true;
  }

  /**
   * Cerrar modal de cancelación
   */
  cerrarModal(): void {
    this.mostrarModal = false;
    this.pedidoAncancelar = null;
    this.cancelandoPedido = false;
  }

  /**
   * Confirmar cancelación del pedido
   */
  confirmarCancelacion(): void {
    if (!this.pedidoAncancelar) return;

    this.cancelandoPedido = true;
    const idPedido = this.pedidoAncancelar.idPedido;

    this.pedidosService.cancelarPedido(idPedido).subscribe({
      next: () => {
        // Actualizar el estado del pedido en la lista local
        const pedido = this.pedidos.find(p => p.idPedido === idPedido);
        if (pedido) {
          pedido.estado = 'CANCELADO';
        }
        
        this.cancelandoPedido = false;
        this.cerrarModal();
        // Recargar pedidos para asegurar sincronización
        this.cargarPedidos();
      },
      error: (error) => {
        console.error('Error al cancelar pedido:', error);
        this.cancelandoPedido = false;
        alert('Error al cancelar el pedido. Por favor intenta nuevamente.');
      }
    });
  }

  /**
   * Obtener clase CSS según el estado del pedido
   */
  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'estado-pendiente';
      case 'CONFIRMADO':
        return 'estado-confirmado';
      case 'ENVIADO':
        return 'estado-enviado';
      case 'ENTREGADO':
        return 'estado-entregado';
      case 'CANCELADO':
        return 'estado-cancelado';
      default:
        return '';
    }
  }

  /**
   * Obtener texto descriptivo del estado
   */
  obtenerTextoEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'Pendiente de confirmación';
      case 'CONFIRMADO':
        return 'Confirmado';
      case 'ENVIADO':
        return 'Enviado';
      case 'ENTREGADO':
        return 'Entregado';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return estado;
    }
  }

  /**
   * Verificar si un pedido puede ser cancelado
   */
  puedeCancelarse(pedido: Pedido): boolean {
    return pedido.estado === 'PENDIENTE';
  }

  /**
   * Formatear fecha a formato legible
   */
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
