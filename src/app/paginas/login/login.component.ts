import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from "@angular/router";
import { AuthService, DTOLogin } from '../../servicios/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  // Formulario reactivo
  formularioLogin!: FormGroup;

  // Estados
  cargando = false;
  mostrarPassword = false;
  mensajeError: string | null = null;
  urlRetorno: string = '/';

  // Para destruir subscripciones
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir
    if (this.authService.estaAutenticado()) {
      if (this.authService.esAdministrador()) {
        this.router.navigate(['/inicioadmin']);
      } else {
        this.router.navigate(['/']);
      }
      return;
    }

    // Obtener URL de retorno de los parámetros de la ruta
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.urlRetorno = params['returnUrl'] || '/';
    });

    // Suscribirse a cambios de estado del servicio
    this.authService.cargando$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(cargando => {
      this.cargando = cargando;
    });

    this.authService.error$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(error => {
      this.mensajeError = error;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Crear formulario reactivo con validaciones
   */
  private crearFormulario(): void {
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Realizar login
   */
  login(): void {
    // Validar que el formulario sea válido
    if (this.formularioLogin.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    // Limpiar errores previos
    this.authService.limpiarError();
    this.mensajeError = null;

    // Obtener datos del formulario
    const datosLogin: DTOLogin = {
      email: this.formularioLogin.get('email')?.value,
      contraseña: this.formularioLogin.get('contraseña')?.value
    };

    // Llamar al servicio de autenticación
    this.authService.login(datosLogin).subscribe({
      next: (response) => {
        // Login exitoso - redirigir según rol
        if (response.rol === 'ROLE_ADMINISTRADOR') {
          this.router.navigate(['/inicioadmin']);
        } else {
          this.router.navigate([this.urlRetorno]);
        }
      },
      error: (error) => {
        // Error en el login
        console.error('Error en login:', error);
        // El error ya está en el observable del servicio
      }
    });
  }

  /**
   * Marcar todos los campos como tocados para mostrar validaciones
   */
  private marcarCamposComoTocados(): void {
    Object.keys(this.formularioLogin.controls).forEach(key => {
      this.formularioLogin.get(key)?.markAsTouched();
    });
  }

  /**
   * Obtener mensaje de error para un campo
   */
  obtenerMensajeError(nombreCampo: string): string {
    const campo = this.formularioLogin.get(nombreCampo);

    if (!campo || !campo.errors || !campo.touched) {
      return '';
    }

    if (campo.errors['required']) {
      return `${nombreCampo} es requerido`;
    }
    if (campo.errors['minlength']) {
      const minLength = campo.errors['minlength'].requiredLength;
      return `${nombreCampo} debe tener al menos ${minLength} caracteres`;
    }
    if (campo.errors['email']) {
      return 'Email inválido';
    }

    return '';
  }

  /**
   * Alternar visibilidad de contraseña
   */
  alternarVisibilidad(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
