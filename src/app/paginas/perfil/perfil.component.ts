import { Component } from '@angular/core';
import { NavbarComponent } from "../../componentes/navbar/navbar.component";
import { FooterComponent } from "../../componentes/footer/footer.component";

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

}
