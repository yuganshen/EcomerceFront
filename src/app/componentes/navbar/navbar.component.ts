import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
//para manejar los desplgables
export class NavbarComponent {
  //para el logout que aun no fun
  logout() {
  console.log("Usuario logout");
}
activeTab: string = '';

selectTab(tab: string) {
  this.activeTab = tab;
}

}
