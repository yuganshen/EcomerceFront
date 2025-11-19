import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import {  MemoriasRamComponent } from './paginas/memorias-ram/memorias-ram.component';
import { ProcesadoresComponent } from './paginas/procesadores/procesadores.component';

export const routes: Routes = [
     { path: '', component: InicioComponent }, // página principal
      { path: 'memorias', component: MemoriasRamComponent },
      { path: 'procesadores', component: ProcesadoresComponent }
];
