import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiPedidoService {
  private url = 'http://localhost:8082/api/pedidos';  // tu endpoint del back
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  obtenerPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/obtenerPedidos`);
  }
  
  cambiarEstadoPedido(id: number): Observable<any> {
  return this.http.put(`${this.url}/cambiarEstado/${id}`, {});
}

}
