import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarAdminComponent } from '../../componentes/navbaradmin/navbaradmin.component';
import { ApiproductoService } from '../../servicios/apiProducto/apiproducto.service';
declare var bootstrap: any;

@Component({
  selector: 'app-gestion-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarAdminComponent, ReactiveFormsModule], // Necesario para usar ngModel
  templateUrl: './gestionproductos.component.html',
  styleUrls: ['./gestionproductos.component.css'],
})
export class GestionProductosComponent {

  productoForm: FormGroup;

  productos: any[] = [];

  productoEdit: any = { idproducto: null, nombre: "", precio: 0, cantidad: 0, tipo: "" };
  modalEditar: any;

  constructor(private fb: FormBuilder, private api: ApiproductoService) { 
    this.productoForm=this.fb.group({
      nombre: ['', Validators   .required],
      descripcion: ['', Validators.required],
      precio: [0, Validators.required],
      stock: [0, Validators.required],
      marca: ['', Validators.required],
      fechaCreacion: [null, Validators.required],
      tipoProducto: ['', Validators.required],
      imagenPrincipal: [null],
      estado: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.api.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
        console.log('Productos cargados:', data);
      },
      error: (err) => {
        console.error('Error al listar productos:', err);
      }
    });
  }

  agregarProducto(){
    if(this.productoForm.valid){
      console.log(this.productoForm.value);
      this.api.agregarProducto(this.productoForm.value).subscribe({
        next: (res) => {
          console.log("Producto registrado:", res);
          this.productoForm.reset();
        },
        error: (err) => {
          console.error("Error al enviar:", err);
        }
      });
    }
  }
/*
  eliminarProducto(id: number) {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.api.eliminarProducto(id).subscribe(() => {
        this.cargarProductos(); 
      });
    }
  }

  filtrar(event: any) {
    const tipo = event.target.value;
    if (tipo === "") {
      this.cargarProductos(); 
    } else {
      this.api.filtrarPorTipo(tipo).subscribe(data => {
        this.productos = data;
      });
    }
  }

  editarProducto(id: number) {
  this.api.obtenerProductoPorId(id).subscribe(prod => {
    this.productoEdit = { ...prod }; 


    this.modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));
    this.modalEditar.show();
  });
}

guardarCambios() {
  const id = this.productoEdit.idproducto;

  this.api.editarProducto(id, this.productoEdit).subscribe(() => {
    alert("Producto actualizado correctamente");

    this.modalEditar.hide(); 
    this.cargarProductos();  
  });
------------------------------------------------------------------*/


  /*
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
  }*/
}
