import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { MemoriasRamComponent } from './paginas/memorias-ram/memorias-ram.component';
import { ProcesadoresComponent } from './paginas/procesadores/procesadores.component';
import { CarritoComponent } from './paginas/carrito/carrito.component';
import { GestionPedidosComponent } from './paginas/gestionpedidos/gestionpedidos.component';
import { GestionUsuariosComponent } from './paginas/gestionusuarios/gestionusuarios.component';
import { InicioAdminComponent } from './paginas/inicioadmin/inicioadmin.component';
import { LoginComponent } from './paginas/login/login.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { ComprasComponent } from './paginas/compras/compras.component';
import { DetallecompraComponent } from './paginas/detallecompra/detallecompra.component';
import { PagoComponent } from './paginas/pago/pago.component';
import { GestionProductosComponent } from './paginas/gestionproductos/gestionproductos.component';

export const routes: Routes = [
  { path: '', component: InicioComponent }, // página principal
  { path: 'carrito', component: CarritoComponent },
  { path: 'memorias', component: MemoriasRamComponent },
  { path: 'procesadores', component: ProcesadoresComponent },
  { path: 'gestionpedidos', component: GestionPedidosComponent },
  { path: 'gestionproductos', component: GestionProductosComponent },
  { path: 'gestionusuarios', component: GestionUsuariosComponent },
  { path: 'inicioadmin', component: InicioAdminComponent },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'compras', component: ComprasComponent },
  { path: 'detallecompra', component: DetallecompraComponent },
  { path: 'pago', component: PagoComponent }
];
