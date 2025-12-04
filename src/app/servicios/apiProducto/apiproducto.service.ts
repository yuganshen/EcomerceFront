import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiproductoService {

  private url = 'http://localhost:8082/apiproducto';  // tu endpoint del back

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/obtenerProductos`);
  }

  filtrarPorTipo(tipo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/filtrarProductos?tipo=${tipo}`);
  }
}
