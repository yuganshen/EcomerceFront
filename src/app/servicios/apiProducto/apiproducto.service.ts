import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiproductoService {

  private url = 'http://localhost:8082/apiproducto';  // tu endpoint del back

  constructor(private http: HttpClient, private authService: AuthService) { }

  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/obtenerProductos`);
  }

  filtrarPorTipo(tipo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/filtrarProductos?tipo=${tipo}`);
  }

  agregarProducto(data: any): Observable<any> {
    const token = this.authService.obtenerToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.url}/agregaProducto`, data, { headers, responseType: 'text' });
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.url}/eliminar/${id}`, { responseType: 'text' });
  }

  obtenerProductoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/producto/${id}`);
  }

  editarProducto(id: number, data: any): Observable<any> {
  return this.http.put(`${this.url}/editar/${id}`, data, { responseType: 'text' });
}

}
