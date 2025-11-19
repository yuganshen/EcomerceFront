import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import {  MemoriasRamComponent } from './paginas/memorias-ram/memorias-ram.component';
import { ProcesadoresComponent } from './paginas/procesadores/procesadores.component';
import { CarritoComponent } from './paginas/carrito/carrito.component';
import { ComprasComponent } from './paginas/compras/compras.component';
import { DetallecompraComponent } from './paginas/detallecompra/detallecompra.component';
import { PagoComponent } from './paginas/pago/pago.component';

export const routes: Routes = [
     { path: '', component: InicioComponent }, // página principal
   { path: 'carrito', component: CarritoComponent },
      { path: 'memorias', component: MemoriasRamComponent },
      { path: 'procesadores', component: ProcesadoresComponent },
      { path: 'compras', component: ComprasComponent },
  { path: 'detallecompra', component: DetallecompraComponent },
  { path: 'pago', component: PagoComponent }

];
