import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-productos',
  standalone: true,
  imports: [CommonModule, FormsModule], // Necesario para usar ngModel
  templateUrl: './gestionproductos.component.html',
  styleUrls: ['./gestionproductos.component.css'],
})
export class GestionProductosComponent {
  products: { name: string; price: number }[] = [];
  productName: string = '';
  productPrice: string | number = '';

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    const stored = localStorage.getItem('products');
    this.products = stored ? JSON.parse(stored) : [];
  }

  saveProducts() {
    localStorage.setItem('products', JSON.stringify(this.products));
  }
addProduct() {
    if (!this.productName || !this.productPrice) {
      alert('Completa todos los campos');
      return;
    }

    this.products.push({
      name: this.productName,
      price: Number(this.productPrice),
    });

    this.saveProducts();

    // Limpiar inputs
    this.productName = '';
    this.productPrice = '';
  }

  editProduct(index: number) {
    const newName = prompt(
      'Nuevo nombre del producto:',
      this.products[index].name
    );
    const newPrice = prompt(
      'Nuevo precio:',
      this.products[index].price.toString()
    );

    if (newName && newPrice) {
      this.products[index] = {
        name: newName,
        price: Number(newPrice),
      };

       this.saveProducts();
    }
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);
    this.saveProducts();
  }
}
