import { Component } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { FooterComponent } from '../../componentes/footer/footer.component';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from "@angular/router";


@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent {
comprobante = 'boleta';
  entrega = 'recojo';
  pago = '';
}
