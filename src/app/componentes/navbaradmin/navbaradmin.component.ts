import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';


@Component({
  selector: 'app-navbaradmin',
  imports: [CommonModule, RouterModule],
  standalone: true, 
  templateUrl: './navbaradmin.component.html',
  styleUrls: ['./navbaradmin.component.css'],
})
export class NavbarAdminComponent {

  mobileOpen = false;
  userOpen = false;

  constructor(private authService: AuthService) {}

  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
  }

  toggleUserMenu() {
    this.userOpen = !this.userOpen;
  }
  
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log("Sesión cerrada exitosamente");
      },
      error: (error: any) => {
        console.error("Error al cerrar sesión:", error);
      }
    });
  }
}