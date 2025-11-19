import { Component } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { FooterComponent } from '../../componentes/footer/footer.component';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NavbarComponent,
    FooterComponent, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  constructor(private router: Router) {}

  goToPago(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.router.navigate(['/pago']);
  }

}
