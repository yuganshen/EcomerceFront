import { Component , ElementRef, HostListener, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

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
    console.log("Cerrar sesión");
  }
}
