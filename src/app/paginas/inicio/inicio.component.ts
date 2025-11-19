import { Component } from '@angular/core';
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

suscribirse() {
  console.log("Usuario suscrito");
}


}
