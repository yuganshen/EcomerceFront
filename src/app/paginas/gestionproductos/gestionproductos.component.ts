import { Component, ViewChild } from '@angular/core';
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
  @ViewChild('inputAdd') inputAdd!: any;
  @ViewChild('inputEdit') inputEdit!: any;


  productos: any[] = [];

  productoEdit: any = { idproducto: null, nombre: "", precio: 0, cantidad: 0, tipo: "" };
  modalEditar: any;

  previewNuevaImagen: any = null;
  archivoNuevaImagen: File | null = null;

  constructor(private fb: FormBuilder, private api: ApiproductoService) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
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

  onArchivoSeleccionado(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      this.productoForm.patchValue({
        imagenPrincipal: archivo
      });
    }
  }



  onNuevaImagen(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.archivoNuevaImagen = file;

    // Vista previa
    const reader = new FileReader();
    reader.onload = () => {
      this.previewNuevaImagen = reader.result; // base64 temporal
    };
    reader.readAsDataURL(file);
  }




  agregarProducto() {
    if (this.productoForm.valid) {
      const formData = new FormData();

      // Recorremos los campos del formulario
      Object.keys(this.productoForm.value).forEach(key => {
        // Si es el archivo, lo agregamos correctamente
        if (key === 'imagenPrincipal' && this.productoForm.value[key]) {
          formData.append(key, this.productoForm.value[key]);
        } else {
          formData.append(key, this.productoForm.value[key]);
        }
      });

      this.api.agregarProducto(formData).subscribe({
        next: (res) => {
          console.log("Producto registrado:", res);
          this.productoForm.reset();
          this.inputAdd.nativeElement.value = "";  // <<< limpia el archivo

          this.cargarProductos();
        },
        error: (err) => {
          console.error("Error al enviar:", err);
        }
      });
    }
  }

  eliminarProducto(id: number) {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.api.eliminarProducto(id).subscribe(() => {
        this.cargarProductos();
      });
    }
  }

  editarProducto(id: number) {
    this.api.obtenerProductoPorId(id).subscribe(prod => {
      this.productoEdit = { ...prod }; // clonar datos del backend

      // abrir modal
      this.modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));
      this.modalEditar.show();
    });
  }


  guardarCambios() {
  const formData = new FormData();

  formData.append("nombre", this.productoEdit.nombre);
  formData.append("descripcion", this.productoEdit.descripcion);
  formData.append("precio", this.productoEdit.precio);
  formData.append("stock", this.productoEdit.stock);
  formData.append("marca", this.productoEdit.marca);
  formData.append("tipoProducto", this.productoEdit.tipoProducto);
  formData.append("estado", this.productoEdit.estado);

  if (this.archivoNuevaImagen) {
    formData.append("imagenPrincipal", this.archivoNuevaImagen);
  }

  this.api.editarProducto(this.productoEdit.idProducto, formData).subscribe({
    next: () => {
      alert("Producto actualizado");
      this.cargarProductos();
      this.modalEditar.hide();
      this.inputEdit.nativeElement.value = "";
      this.previewNuevaImagen = null;
      this.archivoNuevaImagen = null;
    },
    error: (err) => console.error(err)
  });
}



}