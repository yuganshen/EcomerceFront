import { Component } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { FooterComponent } from '../../componentes/footer/footer.component';


@Component({
  selector: 'app-memorias-ram',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './memorias-ram.component.html',
  styleUrl: './memorias-ram.component.css'
})
export class MemoriasRamComponent {

}
