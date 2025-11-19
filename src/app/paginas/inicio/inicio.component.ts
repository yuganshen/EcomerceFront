import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { FooterComponent } from '../../componentes/footer/footer.component';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [ 
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']

})
export class InicioComponent {
  agregarAlCarrito() {
  console.log("Producto agregado al carrito");
}
  constructor(private router: Router) {}
suscribirse() {
  console.log("Usuario suscrito");
}
irAlogin() {
  this.router.navigate(['/login']);
}

}
