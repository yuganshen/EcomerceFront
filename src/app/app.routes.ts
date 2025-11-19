import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { CarritoComponent } from './paginas/carrito/carrito.component';

export const routes: Routes = [
     { path: '', component: InicioComponent },// página principal
     { path: 'carrito', component: CarritoComponent }

];
