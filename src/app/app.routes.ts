import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { MemoriasRamComponent } from './paginas/memorias-ram/memorias-ram.component';
import { ProcesadoresComponent } from './paginas/procesadores/procesadores.component';
import { CarritoComponent } from './paginas/carrito/carrito.component';
import { GestionPedidosComponent } from './paginas/gestionpedidos/gestionpedidos.component';
import { GestionUsuariosComponent } from './paginas/gestionusuarios/gestionusuarios.component';
import { InicioAdminComponent } from './paginas/inicioadmin/inicioadmin.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { ComprasComponent } from './paginas/compras/compras.component';
import { DetallecompraComponent } from './paginas/detallecompra/detallecompra.component';
import { PagoComponent } from './paginas/pago/pago.component';
import { GestionProductosComponent } from './paginas/gestionproductos/gestionproductos.component';
import { NavbarAdminComponent } from './componentes/navbaradmin/navbaradmin.component';
import { AuthGuard, AdminGuard } from './servicios/auth.guard';

export const routes: Routes = [
  // Rutas públicas
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'memorias', component: MemoriasRamComponent },
  { path: 'procesadores', component: ProcesadoresComponent },

  // Rutas protegidas (requieren autenticación)
  { path: 'carrito', component: CarritoComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'compras', component: ComprasComponent, canActivate: [AuthGuard] },
  { path: 'detallecompra', component: DetallecompraComponent, canActivate: [AuthGuard] },
  { path: 'pago', component: PagoComponent, canActivate: [AuthGuard] },
  { path: 'gestionpedidos', component: GestionPedidosComponent, canActivate: [AuthGuard] },

  // Rutas de administrador (requieren autenticación + rol admin)
  { path: 'inicioadmin', component: InicioAdminComponent, canActivate: [AdminGuard] },
  { path: 'gestionusuarios', component: GestionUsuariosComponent, canActivate: [AdminGuard] },
  { path: 'gestionproductos', component: GestionProductosComponent, canActivate: [AdminGuard] },
  { path: 'navbaradmin', component: NavbarAdminComponent, canActivate: [AdminGuard] }
];

