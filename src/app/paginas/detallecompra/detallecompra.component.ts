import { Component } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { FooterComponent } from '../../componentes/footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detallecompra',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './detallecompra.component.html',
  styleUrl: './detallecompra.component.css'
})
export class DetallecompraComponent {

}
