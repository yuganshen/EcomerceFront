import { Component } from '@angular/core';

@Component({
  selector: 'app-navbaradmin',
  standalone: true, 
  templateUrl: './navbaradmin.component.html',
  styleUrls: ['./navbaradmin.component.css'],
})
export class NavbarAdminComponent {

  mobileOpen = false;
  userOpen = false;

  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
  }

  toggleUserMenu() {
    this.userOpen = !this.userOpen;
  }
}
