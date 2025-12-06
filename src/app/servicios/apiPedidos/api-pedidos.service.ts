import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

export interface DetallePedido {
  idDetallePedido: number;
  idProducto: number;
  nombreProducto: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
  imagenProducto: string;
}

export interface Pedido {
  idPedido: number;
  idUsuario: number;
  fechaPedido: string;
  estado: string; // PENDIENTE, CONFIRMADO, ENVIADO, ENTREGADO, CANCELADO
  total: number;
  detalles: DetallePedido[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiPedidosService {
  private apiUrl = 'http://localhost:8082/api/pedidos';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Obtener todos los pedidos del usuario autenticado
   */
  obtenerPedidos(): Observable<Pedido[]> {
    const token = this.authService.obtenerToken();
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return this.http.get<Pedido[]>(this.apiUrl, { headers });
  }

  /**
   * Obtener un pedido específico por ID
   */
  obtenerPedidoPorId(idPedido: number): Observable<Pedido> {
    const token = this.authService.obtenerToken();
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return this.http.get<Pedido>(`${this.apiUrl}/${idPedido}`, { headers });
  }

  /**
   * Cancelar un pedido
   */
  cancelarPedido(idPedido: number): Observable<any> {
    const token = this.authService.obtenerToken();
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return this.http.put(`${this.apiUrl}/${idPedido}/cancelar`, {}, { headers });
  }

  /**
   * Crear un nuevo pedido (probablemente desde el carrito)
   */
  crearPedido(pedidoData: any): Observable<any> {
    const token = this.authService.obtenerToken();
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return this.http.post(this.apiUrl, pedidoData, { headers });
  }
}
