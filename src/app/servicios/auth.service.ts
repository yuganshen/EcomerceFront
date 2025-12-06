import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

/**
 * DTOs para comunicación con el backend
 */
export interface DTOLogin {
  email: string;
  contraseña: string;
}

export interface DTORegistro {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  password: string;
}

export interface DTOAuthResponse {
  token: string;
  tipoToken: string;
  email: string;
  rol: string;
  idUsuario: number;
  nombreUsuario: string;
  mensaje: string;
}

export interface DTOErrorAuth {
  codigoError: number;
  mensaje: string;
  descripcion: string;
  timestamp: number;
}

export interface TokenInfo {
  email: string;
  rol: string;
  exp: number;
}

/**
 * Servicio de autenticación que consume los endpoints del backend
 * Maneja login, registro, validación de tokens y estado de usuario
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base del backend (ajustar según tu configuración)
  private readonly API_URL = 'http://localhost:8082/api/auth';

  // Observable del estado del usuario autenticado
  private usuarioAutenticadoSubject = new BehaviorSubject<any>(null);
  public usuarioAutenticado$ = this.usuarioAutenticadoSubject.asObservable();

  // Observable del estado de carga
  private cargandoSubject = new BehaviorSubject<boolean>(false);
  public cargando$ = this.cargandoSubject.asObservable();

  // Observable de errores
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.verificarTokenAlIniciar();
    }
  }

  /**
   * Login - Autentica usuario con email y contraseña
   * @param login Datos de login (email, contraseña)
   * @returns Observable con la respuesta del backend (token + datos usuario)
   */
  login(login: DTOLogin): Observable<DTOAuthResponse> {
    this.cargandoSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<DTOAuthResponse>(`${this.API_URL}/login`, login).pipe(
      tap(
        (response) => {
          // Guardar token en localStorage (solo en navegador)
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('usuario', JSON.stringify(response));
          }
          
          // Actualizar estado del usuario
          this.usuarioAutenticadoSubject.next(response);
          this.cargandoSubject.next(false);
        },
        (error) => {
          // Manejar error
          const mensajeError = error.error?.mensaje || 'Error en el login. Verifica tus credenciales.';
          this.errorSubject.next(mensajeError);
          this.cargandoSubject.next(false);
        }
      )
    );
  }

  /**
   * Registro - Crea nuevo usuario
   * @param registro Datos de registro (nombre, apellidos, email, contraseña, etc)
   * @returns Observable con la respuesta del backend
   */
  registro(registro: DTORegistro): Observable<DTOAuthResponse> {
    this.cargandoSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<DTOAuthResponse>(`${this.API_URL}/registro`, registro).pipe(
      tap(
        (response) => {
          // Guardar token en localStorage después del registro (solo en navegador)
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('usuario', JSON.stringify(response));
          }
          
          // Actualizar estado del usuario
          this.usuarioAutenticadoSubject.next(response);
          this.cargandoSubject.next(false);
        },
        (error) => {
          // Manejar error
          const mensajeError = error.error?.mensaje || 'Error en el registro. Por favor intenta de nuevo.';
          this.errorSubject.next(mensajeError);
          this.cargandoSubject.next(false);
        }
      )
    );
  }

  /**
   * Validar token - Verifica que el token sea válido
   * @param token Token JWT a validar
   * @returns Observable con resultado de validación
   */
  validarToken(token: string): Observable<{ valido: boolean }> {
    const body = { token };
    return this.http.post<{ valido: boolean }>(`${this.API_URL}/validar-token`, body);
  }

  /**
   * Obtener información del usuario autenticado
   * Requiere token válido en Authorization header
   * @returns Observable con los datos del usuario
   */
  obtenerInfoUsuario(): Observable<any> {
    const token = this.obtenerToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<any>(`${this.API_URL}/info`, { headers });
  }

  /**
   * Logout - Limpia el estado y token del usuario
   */


  /**
   * Obtener token del localStorage
   * @returns Token JWT o null si no existe
   */
  obtenerToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem('token');
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns true si existe un token válido
   */
  estaAutenticado(): boolean {
    const token = this.obtenerToken();
    if (!token) {
      return false;
    }
    
    // Verificar que el token no esté expirado
    try {
      const tokenInfo = this.decodificarToken(token);
      if (!tokenInfo) {
        return false;
      }
      
      // Verificar fecha de expiración (exp está en segundos)
      const ahora = Math.floor(Date.now() / 1000);
      return tokenInfo.exp > ahora;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener rol del usuario autenticado
   * @returns Rol del usuario o null
   */
  obtenerRolUsuario(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      return null;
    }
    
    try {
      const usuarioObj = JSON.parse(usuario);
      return usuarioObj.rol || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtener email del usuario autenticado
   * @returns Email del usuario o null
   */
  obtenerEmailUsuario(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      return null;
    }
    
    try {
      const usuarioObj = JSON.parse(usuario);
      return usuarioObj.email || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtener ID del usuario autenticado
   * @returns ID del usuario o null
   */
  obtenerIdUsuario(): number | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      return null;
    }
    
    try {
      const usuarioObj = JSON.parse(usuario);
      return usuarioObj.idUsuario || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verificar si el usuario es administrador
   * @returns true si el rol es ROLE_ADMINISTRADOR
   */
  esAdministrador(): boolean {
    const rol = this.obtenerRolUsuario();
    return rol === 'ROLE_ADMINISTRADOR';
  }

  /**
   * Limpiar mensaje de error
   */
  limpiarError(): void {
    this.errorSubject.next(null);
  }

  /**
   * Decodificar JWT manualmente (sin librería externa)
   * @param token Token JWT
   * @returns Objeto con los claims del token o null
   */
  private decodificarToken(token: string): TokenInfo | null {
    try {
      // JWT está dividido en 3 partes: header.payload.signature
      const partes = token.split('.');
      if (partes.length !== 3) {
        return null;
      }

      // Decodificar el payload (segunda parte)
      const payload = partes[1];
      // Agregar padding si es necesario
      const payloadConPadding = payload + '='.repeat((4 - payload.length % 4) % 4);
      const decodificado = atob(payloadConPadding);
      
      const tokenInfo = JSON.parse(decodificado);
      
      return {
        email: tokenInfo.sub || null,
        rol: tokenInfo.rol || null,
        exp: tokenInfo.exp || 0
      };
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  /**
   * Verificar token al iniciar la aplicación
   * Si hay token guardado, intenta validarlo y restaura el estado del usuario
   */
  private verificarTokenAlIniciar(): void {
    const token = this.obtenerToken();
    if (token) {
      // Intentar validar el token y restaurar el estado
      this.validarToken(token).subscribe(
        (resultado) => {
          if (resultado.valido) {
            // Token válido, intenta obtener info del usuario
            this.obtenerInfoUsuario().subscribe(
              (usuario) => {
                this.usuarioAutenticadoSubject.next(usuario);
              },
              (error) => {
                // Si falla, limpiar token
                this.logout();
              }
            );
          } else {
            // Token inválido, limpiar
            this.logout();
          }
        },
        (error) => {
          // Error al validar, limpiar token
          this.logout();
        }
      );
    }
  }

  /**
   * Logout - Cierra la sesión del usuario
   * Elimina el token del almacenamiento y limpia el estado
   * @returns Observable con la respuesta del backend
   */
  logout(): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/logout`, {}).pipe(
      tap({
        next: () => {
          // Limpiar token y datos del usuario del almacenamiento local
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            localStorage.removeItem('rol');
          }

          // Limpiar el estado
          this.usuarioAutenticadoSubject.next(null);
          this.errorSubject.next(null);

          // Redirigir a login usando router
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          //console.error('Error al cerrar sesión:', err);
          
          // Aunque haya error, limpiar el cliente
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            localStorage.removeItem('rol');
          }

          this.usuarioAutenticadoSubject.next(null);
          this.errorSubject.next('Error al cerrar sesión');
          
          // Redirigir igual aunque haya error
          this.router.navigateByUrl('/');
        }
      }),
      // Asegurar que siempre se completa el Observable
      catchError((error) => {
        // Limpiar incluso si hay error no capturado
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          localStorage.removeItem('rol');
        }
        this.usuarioAutenticadoSubject.next(null);
        this.router.navigateByUrl('/');
        return of({ error: true, message: error });
      })
    );
  }
}
