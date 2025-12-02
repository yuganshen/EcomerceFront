import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { FooterComponent } from '../../componentes/footer/footer.component';
import { ApiproductoService } from '../../servicios/apiProducto/apiproducto.service';
import { CarritoService } from '../../servicios/apiCarrito/api-carrito.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']

})
export class InicioComponent {

  productos: any[] = [];
  mensajeExito: string = '';


  constructor(private router: Router, private apiproducto: ApiproductoService,private carritoService:CarritoService) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.apiproducto.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
        console.log('Productos cargados:', data);
      },
      error: (err) => {
        console.error('Error al listar productos:', err);
      }
    });
  }


   /**
   * Agregar producto al carrito
   */
  agregarAlCarrito(producto: any) {
    // Verificar stock
    if (producto.stock <= 0) {
      alert('Producto sin stock disponible');
      return;
    }
    
    this.carritoService.agregarProducto(producto);
    
    // Mostrar mensaje de éxito
    this.mensajeExito = `✓ ${producto.nombre} agregado al carrito`;
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      this.mensajeExito = '';
    }, 3000);
  }

  /**
   * Verificar si un producto ya está en el carrito
   */
  productoEnCarrito(idProducto: number): boolean {
    return this.carritoService.productoEnCarrito(idProducto);
  }

  suscribirse() {
    console.log("Usuario suscrito");
  }

  irAlogin() {
    this.router.navigate(['/login']);
  }

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }
}
