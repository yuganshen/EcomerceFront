import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { FooterComponent } from '../../componentes/footer/footer.component';
import { ApiproductoService } from '../../servicios/apiProducto/apiproducto.service';
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

  constructor(private router: Router, private apiproducto: ApiproductoService) { }

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


  //---------------------------------------------
  agregarAlCarrito() {
    console.log("Producto agregado al carrito");
  }

  suscribirse() {
    console.log("Usuario suscrito");
  }

  irAlogin() {
    this.router.navigate(['/login']);
  }

}
