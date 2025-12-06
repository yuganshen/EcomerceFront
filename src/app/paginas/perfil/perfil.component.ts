
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../componentes/navbar/navbar.component";
import { FooterComponent } from "../../componentes/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  cargando = false;
  errorMsg = '';
  successMsg = '';

  // Campos del perfil (ajustados a la entidad Usuario)
  nombre = '';
  apellidos = '';
  email = '';
  telefono = '';
  contrasena = '';
  confirmarContrasena = '';

  private apiUrl = 'http://localhost:8082/api/auth';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargando = true;
    const token = this.authService.obtenerToken();
    console.log('Token disponible en cargarPerfil:', !!token);
    console.log('Token value:', token);
    console.log('Usuario autenticado según AuthService:', this.authService.estaAutenticado());
    console.log('Rol del usuario:', this.authService.obtenerRolUsuario());
    
    this.authService.obtenerInfoUsuario().subscribe({
      next: (usuario: any) => {
        this.cargando = false;
        console.log('Perfil cargado exitosamente:', usuario);
        this.nombre = usuario.nombre || '';
        this.apellidos = usuario.apellidos || '';
        this.email = usuario.email || '';
        this.telefono = usuario.telefono || '';
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al cargar perfil:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.statusText);
        console.error('Error body:', err.error);
        this.errorMsg = 'No se pudo cargar el perfil. Por favor inicia sesión.';
      }
    });
  }

  guardarCambios(): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (this.contrasena && this.contrasena !== this.confirmarContrasena) {
      this.errorMsg = 'Las contraseñas no coinciden';
      return;
    }

    const body: any = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      telefono: this.telefono
    };
    if (this.contrasena) body.contraseña = this.contrasena;

    this.cargando = true;

    // Preparar headers con token si existe
    const token = this.authService.obtenerToken();
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    this.http.put<any>(`${this.apiUrl}/info`, body, { headers }).subscribe({
      next: (res) => {
        this.cargando = false;
        this.successMsg = 'Perfil actualizado correctamente';
        // Actualizar info local si es necesario
        // Refrescar usuario en AuthService suscribiendo obtenerInfoUsuario
        this.authService.obtenerInfoUsuario().subscribe();
        // Limpiar campos de contraseña
        this.contrasena = '';
        this.confirmarContrasena = '';
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = err.error?.mensaje || err.error || 'Error al actualizar perfil';
      }
    });
  }
}
