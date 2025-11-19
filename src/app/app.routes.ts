import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import {  MemoriasRamComponent } from './paginas/memorias-ram/memorias-ram.component';
import { ProcesadoresComponent } from './paginas/procesadores/procesadores.component';
import { CarritoComponent } from './paginas/carrito/carrito.component';
import { GestionProductosComponent } from './paginas/gestionproductos/gestionproductos.component';
import { GestionPedidosComponent } from './paginas/gestionpedidos/gestionpedidos.component';
import { GestionUsuariosComponent } from './paginas/gestionusuarios/gestionusuarios.component';
import { InicioAdminComponent } from './paginas/inicioadmin/inicioadmin.component';

export const routes: Routes = [
     { path: '', component: InicioComponent }, // página principal
   { path: 'carrito', component: CarritoComponent },
      { path: 'memorias', component: MemoriasRamComponent },
      { path: 'procesadores', component: ProcesadoresComponent },
      { path: 'gestionproductos', component: GestionProductosComponent },
      { path: 'gestionpedidos', component: GestionPedidosComponent },
      { path: 'gestionusuarios', component: GestionUsuariosComponent },
      { path: 'inicioadmin', component: InicioAdminComponent }

];
