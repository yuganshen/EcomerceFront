import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard que protege rutas requiriendo autenticación
 * Si el usuario no está autenticado, redirige al login
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verificar si el usuario está autenticado
    if (this.authService.estaAutenticado()) {
      return true;
    }

    // Si no está autenticado, redirigir al login con URL de retorno
    this.router.navigate(['/'], {
      queryParams: { returnUrl: state.url }
    });
    
    return false;
  }
}

/**
 * Guard que protege rutas requiriendo rol de administrador
 * Solo administradores pueden acceder a estas rutas
 */
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verificar si está autenticado y es administrador
    if (this.authService.estaAutenticado() && this.authService.esAdministrador()) {
      return true;
    }

    // Si no es administrador o no está autenticado
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/'], {
        queryParams: { returnUrl: state.url }
      });
    } else {
      // Si está autenticado pero no es admin, ir a catalogo
      this.router.navigate(['/catalogo']);
    }
    
    return false;
  }
}
