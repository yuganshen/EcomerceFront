import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, DTORegistro } from '../../servicios/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, OnDestroy {
  // Formulario reactivo
  formularioRegistro!: FormGroup;

  // Estados
  cargando = false;
  mostrarPassword = false;
  mostrarConfirmarPassword = false;
  mensajeError: string | null = null;
  registroExitoso = false;

  // Para destruir subscripciones
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
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
   * Crear formulario reactivo con validaciones según el DTO del backend
   * Campos requeridos: nombre, apellidos, email, telefono, password
   */
  private crearFormulario(): void {
    this.formularioRegistro = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      apellidos: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^[0-9\s\-()+]{7,20}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.validarContrasenas
    });
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   */
  private validarContrasenas(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { 'contrasenaNoCoincide': true };
    }
    return null;
  }

  /**
   * Registrar usuario enviando solo los campos requeridos al backend
   */
  registrar(): void {
    // Validar que el formulario sea válido
    if (this.formularioRegistro.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    // Validar que las contraseñas coincidan
    if (this.formularioRegistro.errors?.['contrasenaNoCoincide']) {
      this.mensajeError = 'Las contraseñas no coinciden';
      return;
    }

    // Limpiar errores previos
    this.authService.limpiarError();
    this.mensajeError = null;

    // Obtener datos del formulario - solo los campos requeridos por el backend
    const datosRegistro: DTORegistro = {
      nombre: this.formularioRegistro.get('nombre')?.value.trim(),
      apellidos: this.formularioRegistro.get('apellidos')?.value.trim(),
      email: this.formularioRegistro.get('email')?.value.trim(),
      telefono: this.formularioRegistro.get('telefono')?.value.trim(),
      password: this.formularioRegistro.get('password')?.value
    };

    // Llamar al servicio de autenticación
    this.authService.registro(datosRegistro).subscribe({
      next: (response) => {
        // Registro exitoso
        this.registroExitoso = true;
        
        // Mostrar mensaje de éxito por 2 segundos
        setTimeout(() => {
          // Redirigir según rol del usuario
          if (response.rol === 'ROLE_ADMINISTRADOR') {
            this.router.navigate(['/inicioadmin']);
          } else {
            this.router.navigate(['/']);
          }
        }, 2000);
      },
      error: (error) => {
        // Error en el registro
        console.error('Error en registro:', error);
        // El error ya está en el observable del servicio
      }
    });
  }

  /**
   * Marcar todos los campos como tocados para mostrar validaciones
   */
  private marcarCamposComoTocados(): void {
    Object.keys(this.formularioRegistro.controls).forEach(key => {
      this.formularioRegistro.get(key)?.markAsTouched();
    });
  }

  /**
   * Obtener mensaje de error para un campo específico
   */
  obtenerMensajeError(nombreCampo: string): string {
    const campo = this.formularioRegistro.get(nombreCampo);

    if (!campo || !campo.errors || !campo.touched) {
      return '';
    }

    // Mensajes de error personalizados según el tipo de validación
    const errorMessages: { [key: string]: { [key: string]: string } } = {
      'nombre': {
        'required': 'El nombre es obligatorio',
        'minlength': 'El nombre debe tener entre 2 y 30 caracteres',
        'maxlength': 'El nombre debe tener entre 2 y 30 caracteres',
        'pattern': 'El nombre solo puede contener letras y espacios'
      },
      'apellidos': {
        'required': 'El apellido es obligatorio',
        'minlength': 'El apellido debe tener entre 2 y 30 caracteres',
        'maxlength': 'El apellido debe tener entre 2 y 30 caracteres',
        'pattern': 'El apellido solo puede contener letras y espacios'
      },
      'email': {
        'required': 'El correo es obligatorio',
        'email': 'El correo debe tener un formato válido'
      },
      'telefono': {
        'required': 'El teléfono es obligatorio',
        'pattern': 'Formato de teléfono no válido'
      },
      'password': {
        'required': 'La contraseña es obligatoria',
        'minlength': 'La contraseña debe tener al menos 8 caracteres'
      },
      'confirmPassword': {
        'required': 'Debe confirmar la contraseña'
      }
    };

    // Buscar el primer error del campo
    const errors = campo.errors;
    for (const errorType in errors) {
      if (errorMessages[nombreCampo]?.[errorType]) {
        return errorMessages[nombreCampo][errorType];
      }
    }

    return 'Este campo tiene un error';
  }

  /**
   * Alternar visibilidad de contraseña
   */
  alternarVisibilidad(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  /**
   * Alternar visibilidad de confirmar contraseña
   */
  alternarVisibilidadConfirmar(): void {
    this.mostrarConfirmarPassword = !this.mostrarConfirmarPassword;
  }
}
