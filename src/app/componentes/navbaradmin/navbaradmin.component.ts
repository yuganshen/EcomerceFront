import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


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

  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
  }

  toggleUserMenu() {
    this.userOpen = !this.userOpen;
  }
}