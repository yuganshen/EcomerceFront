import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarAdminComponent } from '../../componentes/navbaradmin/navbaradmin.component';

@Component({
  selector: 'app-inicio-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarAdminComponent],
  templateUrl: './inicioadmin.component.html',
  styleUrls: ['./inicioadmin.component.css']
})
export class InicioAdminComponent {}
