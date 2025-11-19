import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import {  MemoriasRamComponent } from './paginas/memorias-ram/memorias-ram.component';
import { ProcesadoresComponent } from './paginas/procesadores/procesadores.component';
import { CarritoComponent } from './paginas/carrito/carrito.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';

export const routes: Routes = [
     { path: '', component: InicioComponent }, // página principal
     { path: 'carrito', component: CarritoComponent },
      { path: 'memorias', component: MemoriasRamComponent },
      { path: 'procesadores', component: ProcesadoresComponent },
      { path: 'perfil', component: PerfilComponent }


];
