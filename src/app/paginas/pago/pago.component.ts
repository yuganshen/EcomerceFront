import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { FooterComponent } from '../../componentes/footer/footer.component';
import { NgIf, CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { Carrito, CarritoService } from '../../servicios/apiCarrito/api-carrito.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, NgIf, CommonModule, RouterLink, FormsModule],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent implements OnInit {
  comprobante = 'boleta';
  entrega = 'recojo';
  pago = '';

  // Datos del carrito
  carrito: Carrito = {
    items: [],
    total: 0,
    cantidadTotal: 0
  };

  // Configuración de envío
  readonly COSTO_ENVIO = 30.98;
  readonly ENVIO_GRATIS_MINIMO = 500;

  // Campos para métodos de pago
  // Tarjeta
  cardNumber = '';
  cardExpiry = '';
  cardCVV = '';
  cardHolder = '';

  // Billeteras
  walletProvider = '';
  walletPhone = '';

  // Estado del comprobante impreso en pantalla
  receiptShown = false;
  receiptData: any = null;
  
  // Campos adicionales para crear pedido
  direccionEnvio = '';
  cargando = false;
  errorMsg = '';
  
  // URL del backend
  private backendUrl = 'http://localhost:8082/api/pedidos';

  constructor(
    private router: Router,
    private carritoService: CarritoService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener datos del estado del router (cuando viene desde carrito)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['carrito']) {
      this.carrito = navigation.extras.state['carrito'];
    } else {
      // Si no viene estado, suscribirse al servicio del carrito
      this.carritoService.carrito$.subscribe({
        next: (carrito) => {
          this.carrito = carrito;
        }
      });
    }
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
   * Finalizar compra: validar, enviar al backend y mostrar comprobante
   */
  finalizarCompra(): void {
    // Validaciones básicas antes de procesar
    if (this.carrito.items.length === 0) {
      this.errorMsg = 'El carrito está vacío';
      return;
    }

    if (!this.pago) {
      this.errorMsg = 'Por favor selecciona un método de pago';
      return;
    }

    if (!this.direccionEnvio.trim()) {
      this.errorMsg = 'Por favor ingresa la dirección de envío';
      return;
    }

    // Validar campos según método de pago
    if (this.pago === 'credito' || this.pago === 'debito') {
      if (!this.cardNumber || !this.cardExpiry || !this.cardCVV || !this.cardHolder) {
        this.errorMsg = 'Completa todos los campos de la tarjeta';
        return;
      }
    } else if (this.pago === 'billeteras') {
      if (!this.walletProvider || !this.walletPhone) {
        this.errorMsg = 'Completa los datos de la billetera digital';
        return;
      }
    }

    // Limpiar mensaje de error si todas las validaciones pasaron
    this.errorMsg = '';
    this.cargando = true;

    // Construir objeto DTOPedidoRequest
    const pedidoRequest = {
      direccionEnvio: this.direccionEnvio,
      tipoEntrega: this.entrega,
      metodoPago: this.pago,
      tipoComprobante: this.comprobante,
      items: this.carrito.items.map(item => ({
        productoId: item.idProducto,
        cantidad: item.cantidad
      }))
    };

    console.log('Enviando pedido al backend:', pedidoRequest);

    // Enviar al backend con token JWT
    const token = this.authService.obtenerToken();
    console.log('Token obtenido:', token ? 'Sí' : 'No');
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    this.http.post<any>(this.backendUrl, pedidoRequest, { headers })
      .subscribe({
        next: (pedidoGuardado: any) => {
          this.cargando = false;
          console.log('Pedido guardado en backend:', pedidoGuardado);

          // Generar comprobante a mostrar en pantalla
          this.receiptData = {
            idPedido: pedidoGuardado?.idPedido || 'N/A',
            fecha: new Date(),
            items: this.carrito.items.map(i => ({ nombre: i.nombre, cantidad: i.cantidad, subtotal: i.subtotal })),
            subtotal: this.carrito.total,
            envio: this.costoEnvio,
            total: this.totalFinal,
            metodoPago: this.pago,
            direccionEnvio: this.direccionEnvio,
            tipoEntrega: this.entrega,
            detallesPago: this.pago === 'billeteras' ? { provider: this.walletProvider, phone: this.walletPhone } : { holder: this.cardHolder, card: this.maskCard(this.cardNumber) }
          };

          this.receiptShown = true;
          console.log('Comprobante generado:', this.receiptData);
        },
        error: (error) => {
          this.cargando = false;
          console.error('Error al guardar pedido:', error);
          console.error('Error response:', error.error);
          console.error('Error status:', error.status);
          console.error('Error statusText:', error.statusText);
          
          // Intentar extraer el mensaje de error del backend
          let mensajeError = 'Error al procesar el pedido. Por favor intenta nuevamente.';
          if (error.error && typeof error.error === 'string') {
            mensajeError = error.error;
          } else if (error.error && error.error.message) {
            mensajeError = error.error.message;
          } else if (error.message) {
            mensajeError = error.message;
          }
          
          // Si es 401, mostrar mensaje específico
          if (error.status === 401) {
            mensajeError = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
            console.warn('Sesión expirada - redireccionar a login');
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          }
          
          this.errorMsg = mensajeError;
        }
      });
  }

  /** Devuelve true si el formulario de pago está completo y se puede finalizar */
  get canFinalize(): boolean {
    if (this.carrito.items.length === 0) return false;
    if (!this.pago) return false;
    if (this.pago === 'credito' || this.pago === 'debito') {
      return !!(this.cardNumber && this.cardExpiry && this.cardCVV && this.cardHolder);
    }
    if (this.pago === 'billeteras') {
      return !!(this.walletProvider && this.walletPhone);
    }
    return false;
  }

  /** Mascarar número de tarjeta para mostrar en comprobante */
  private maskCard(card: string): string {
    const digits = card.replace(/\D/g, '');
    if (digits.length <= 4) return '****';
    const last4 = digits.slice(-4);
    return '**** **** **** ' + last4;
  }

  /** Imprimir comprobante (usa window.print) */
  printReceipt(): void {
    // Hacer que la vista muestre sólo el comprobante en impresión mediante CSS si existe
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.warn('Impresión no soportada en este entorno:', e);
      }
    }, 100);
  }

  /**
   * Volver al carrito
   */
  volverAlCarrito(): void {
    this.router.navigate(['/carrito']);
  }

  /** Completar el flujo: vaciar carrito y volver al inicio */
  completeAndFinish(): void {
    try {
      this.carritoService.vaciarCarrito();
    } catch (e) {
      console.warn('No se pudo vaciar el carrito:', e);
    }
    this.receiptShown = false;
    this.errorMsg = '';
    this.router.navigate(['/']);
  }
}
