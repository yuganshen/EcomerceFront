import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { FooterComponent } from '../../componentes/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { CarritoService, Carrito, ItemCarrito } from '../../servicios/apiCarrito/api-carrito.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterModule, CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  
  carrito: Carrito = {
    items: [],
    total: 0,
    cantidadTotal: 0
  };

  // Configuración de envío
  readonly COSTO_ENVIO = 30.98;
  readonly ENVIO_GRATIS_MINIMO = 500;

  constructor(
    private router: Router,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    // Suscribirse al carrito para obtener actualizaciones en tiempo real
    this.carritoService.carrito$.subscribe({
      next: (carrito) => {
        this.carrito = carrito;
      }
    });
  }

  /**
   * Calcular costo de envío
   */
  get costoEnvio(): number {
    return this.carrito.total >= this.ENVIO_GRATIS_MINIMO ? 0 : this.COSTO_ENVIO;
  }

  /**
   * Calcular total final (subtotal + envío)
   */
  get totalFinal(): number {
    return this.carrito.total + this.costoEnvio;
  }

  /**
   * Calcular cuánto falta para envío gratis
   */
  get faltaParaEnvioGratis(): number {
    return Math.max(0, this.ENVIO_GRATIS_MINIMO - this.carrito.total);
  }

  /**
   * Verificar si tiene envío gratis
   */
  get tieneEnvioGratis(): boolean {
    return this.carrito.total >= this.ENVIO_GRATIS_MINIMO;
  }

  /**
   * Aumentar cantidad de un producto
   */
  aumentarCantidad(item: ItemCarrito): void {
    if (item.cantidad >= item.stock) {
      alert(`Solo hay ${item.stock} unidades disponibles`);
      return;
    }
    this.carritoService.actualizarCantidad(item.idProducto, item.cantidad + 1);
  }

  /**
   * Disminuir cantidad de un producto
   */
  disminuirCantidad(item: ItemCarrito): void {
    if (item.cantidad > 1) {
      this.carritoService.actualizarCantidad(item.idProducto, item.cantidad - 1);
    } else {
      // Si la cantidad es 1, preguntar si desea eliminar
      this.eliminarProducto(item.idProducto);
    }
  }

  /**
   * Eliminar producto del carrito
   */
  eliminarProducto(idProducto: number): void {
    if (confirm('¿Estás seguro de eliminar este producto del carrito?')) {
      this.carritoService.eliminarProducto(idProducto);
    }
  }

  /**
   * Vaciar todo el carrito
   */
  vaciarCarrito(): void {
    if (confirm('¿Estás seguro de vaciar todo el carrito?')) {
      this.carritoService.vaciarCarrito();
    }
  }

  /**
   * Ir a la página de pago
   */
  goToPago(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    
    if (this.carrito.items.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    // Aquí puedes pasar el carrito como state o guardarlo para usarlo en la página de pago
    this.router.navigate(['/pago'], {
      state: { carrito: this.carrito }
    });
  }

  /**
   * Continuar comprando
   */
  continuarComprando(): void {
    this.router.navigate(['/']);
  }
}