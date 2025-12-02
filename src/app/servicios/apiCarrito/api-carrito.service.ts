import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface ItemCarrito {
  idProducto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenPrincipal: string;
  marca: string;
  descripcion: string;
  subtotal: number;
  stock: number;
}

export interface Carrito {
  items: ItemCarrito[];
  total: number;
  cantidadTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private readonly STORAGE_KEY = 'carrito_compras';
  
  // Observable para que los componentes se suscriban
  private carritoSubject = new BehaviorSubject<Carrito>(this.obtenerCarritoInicial());
  public carrito$ = this.carritoSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Cargar el carrito al iniciar el servicio
    this.cargarCarritoDesdeStorage();
  }

  /**
   * Cargar carrito desde localStorage al iniciar
   */
  private cargarCarritoDesdeStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const carritoGuardado = localStorage.getItem(this.STORAGE_KEY);
      if (carritoGuardado) {
        try {
          const carrito = JSON.parse(carritoGuardado);
          this.carritoSubject.next(carrito);
          console.log('Carrito cargado desde localStorage:', carrito);
        } catch (error) {
          console.error('Error al cargar el carrito:', error);
          this.limpiarStorage();
        }
      }
    }
  }

  /**
   * Obtener carrito inicial
   */
  private obtenerCarritoInicial(): Carrito {
    return {
      items: [],
      total: 0,
      cantidadTotal: 0
    };
  }

  /**
   * Guardar carrito en localStorage
   */
  private guardarCarrito(carrito: Carrito): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(carrito));
        console.log('Carrito guardado en localStorage:', carrito);
      } catch (error) {
        console.error('Error al guardar el carrito:', error);
      }
    }
    this.carritoSubject.next(carrito);
  }

  /**
   * Limpiar storage corrupto
   */
  private limpiarStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Calcular totales del carrito
   */
  private calcularTotales(items: ItemCarrito[]): { total: number; cantidadTotal: number } {
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const cantidadTotal = items.reduce((sum, item) => sum + item.cantidad, 0);
    return { total, cantidadTotal };
  }

  /**
   * Agregar producto al carrito
   */
  agregarProducto(producto: any): void {
    const carritoActual = this.carritoSubject.value;
    const items = [...carritoActual.items];
    
    // Verificar si el producto ya existe en el carrito
    const index = items.findIndex(item => item.idProducto === producto.idProducto);
    
    if (index !== -1) {
      // Si existe, aumentar cantidad
      items[index].cantidad++;
      items[index].subtotal = items[index].cantidad * items[index].precio;
    } else {
      // Si no existe, agregarlo
      const nuevoItem: ItemCarrito = {
        idProducto: producto.idProducto,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        imagenPrincipal: producto.imagenPrincipal,
        marca: producto.marca,
        descripcion: producto.descripcion,
        subtotal: producto.precio,
        stock: producto.stock
      };
      items.push(nuevoItem);
    }
    
    const { total, cantidadTotal } = this.calcularTotales(items);
    const carritoActualizado: Carrito = { items, total, cantidadTotal };
    
    this.guardarCarrito(carritoActualizado);
  }

  /**
   * Actualizar cantidad de un producto
   */
  actualizarCantidad(idProducto: number, cantidad: number): void {
    const carritoActual = this.carritoSubject.value;
    const items = [...carritoActual.items];
    
    const index = items.findIndex(item => item.idProducto === idProducto);
    
    if (index !== -1) {
      // Verificar que no exceda el stock
      if (cantidad > items[index].stock) {
        alert(`Solo hay ${items[index].stock} unidades disponibles`);
        return;
      }
      
      items[index].cantidad = cantidad;
      items[index].subtotal = items[index].cantidad * items[index].precio;
      
      const { total, cantidadTotal } = this.calcularTotales(items);
      const carritoActualizado: Carrito = { items, total, cantidadTotal };
      
      this.guardarCarrito(carritoActualizado);
    }
  }

  /**
   * Eliminar producto del carrito
   */
  eliminarProducto(idProducto: number): void {
    const carritoActual = this.carritoSubject.value;
    const items = carritoActual.items.filter(item => item.idProducto !== idProducto);
    
    const { total, cantidadTotal } = this.calcularTotales(items);
    const carritoActualizado: Carrito = { items, total, cantidadTotal };
    
    this.guardarCarrito(carritoActualizado);
  }

  /**
   * Vaciar todo el carrito
   */
  vaciarCarrito(): void {
    const carritoVacio: Carrito = {
      items: [],
      total: 0,
      cantidadTotal: 0
    };
    this.guardarCarrito(carritoVacio);
  }

  /**
   * Obtener el carrito actual
   */
  obtenerCarrito(): Carrito {
    return this.carritoSubject.value;
  }

  /**
   * Obtener cantidad de items en el carrito
   */
  obtenerCantidadItems(): number {
    return this.carritoSubject.value.cantidadTotal;
  }

  /**
   * Verificar si un producto está en el carrito
   */
  productoEnCarrito(idProducto: number): boolean {
    const carrito = this.carritoSubject.value;
    return carrito.items.some(item => item.idProducto === idProducto);
  }
}