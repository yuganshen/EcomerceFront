import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarAdminComponent } from '../../componentes/navbaradmin/navbaradmin.component';


interface Usuario {
  id: number;
  name: string;
  role: string;
  active: boolean;
}

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarAdminComponent ],
  templateUrl: './gestionusuarios.component.html',
  styleUrls: ['./gestionusuarios.component.css']
})
export class GestionUsuariosComponent {
  users: Usuario[] = [
    { id: 1, name: 'Carlos', role: 'Admin', active: true },
    { id: 2, name: 'Lucía', role: 'Cliente', active: false }
  ];

  toggleUser(id: number) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.active = !user.active;
    }
  }
}
