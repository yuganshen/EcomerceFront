import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

/**
 * Interceptor HTTP que:
 * 1. Agrega el JWT automáticamente a cada solicitud
 * 2. Maneja errores de autenticación (401)
 * 3. Redirige al login si el token expiró
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener token del servicio de autenticación
    const token = this.authService.obtenerToken();

    // Si existe token, agregarlo al header Authorization
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Interceptor: Token agregado a solicitud', request.url);
    } else {
      console.log('Interceptor: No hay token disponible para solicitud', request.url);
    }

    // Pasar la solicitud al siguiente manejador y manejar errores
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Interceptor: Error en solicitud', request.url, 'Status:', error.status);
        
        // Si es error 401 (Unauthorized), el token expiró o es inválido
        // Solo hacer logout si es una solicitud GET a /api/auth/info (verificación de sesión)
        // Para otras solicitudes, dejar que el componente maneje el error
        if (error.status === 401 && request.method === 'GET' && request.url.includes('/api/auth/info')) {
          console.error('Interceptor: Token inválido o expirado (GET /auth/info) - limpiando autenticación');
          // Limpiar datos de autenticación
          this.authService.logout();
          
          // Redirigir al login
          this.router.navigate(['/'], {
            queryParams: { returnUrl: this.router.url }
          });
        } else if (error.status === 401) {
          console.warn('Interceptor: Error 401 en solicitud', request.method, request.url, '- no haciendo logout automático');
        }

        // Si es error 403 (Forbidden), no tiene permisos
        if (error.status === 403) {
          console.error('Interceptor: Acceso denegado (403). No tienes permisos para esta acción.');
        }

        // Propagar el error
        return throwError(() => error);
      })
    );
  }
}
