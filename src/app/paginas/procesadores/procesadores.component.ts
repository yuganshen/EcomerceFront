import { Component } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { FooterComponent } from '../../componentes/footer/footer.component';

@Component({
  selector: 'app-procesadores',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './procesadores.component.html',
  styleUrl: './procesadores.component.css'
})
export class ProcesadoresComponent {

}
