import { Component, OnInit , ElementRef, HostListener, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../servicios/apiCarrito/api-carrito.service';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
   cantidadItems: number = 0;
constructor(private carritoService: CarritoService, private authService: AuthService) {}

  ngOnInit(): void {
    // Suscribirse para actualizar la cantidad en tiempo real
    this.carritoService.carrito$.subscribe(carrito => {
      this.cantidadItems = carrito.cantidadTotal;
    });
  }


mobileOpen = false;
userHover = false;
productsHover = false;

toggleMobile() {
  this.mobileOpen = !this.mobileOpen;
}

hoverUser(state: boolean) {
  this.userHover = state;
}

hoverProducts(state: boolean) {
  this.productsHover = state;
}

userOpen = false;

  @ViewChild('userMenu') userMenu!: ElementRef;

  toggleUserMenu() {
    this.userOpen = !this.userOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.userMenu && !this.userMenu.nativeElement.contains(event.target)) {
      this.userOpen = false;
    }
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
