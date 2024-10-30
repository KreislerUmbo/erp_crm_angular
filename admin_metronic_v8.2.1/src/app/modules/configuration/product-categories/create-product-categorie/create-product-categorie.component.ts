import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProductCategorieService } from '../service/product-categorie.service';

@Component({
  selector: 'app-create-product-categorie',
  templateUrl: './create-product-categorie.component.html',
  styleUrls: ['./create-product-categorie.component.scss']
})
export class CreateProductCategorieComponent {

  @Output() CategoriaCreate: EventEmitter<any> = new EventEmitter();
  name: string = '';
  isLoading: any;

  image_categorie: any;
  image_previsualiza: any;

  constructor(
    public modal: NgbActiveModal,
    public productCategorieService: ProductCategorieService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }


  processFile($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) { //validamos para tipo de archivo jpg,png 
      this.toast.warning("WARM", "El archivo no es una imagen");
      return false;
    }

    this.image_categorie = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.image_categorie);
    reader.onloadend = () => this.image_previsualiza = reader.result;
  }

  store() {
    if (!this.name) {
      this.toast.error("Validacion:", "EL NOMBRE DE LA CATEGORÍA ES OBLIGATORIO");
      return false;
    }


    /*   let data = { 
        name: this.name,
      }se cambia por formdata por la imagen ya no let data */
    let formData = new FormData();
    formData.append("name", this.name);
    formData.append("categorie_imagen", this.image_categorie); //categorie_imagen vien del controlador hasFile de store

    this.productCategorieService.registerCategorieProduct(formData).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "La Categoría se Registró Correctamente");
        this.CategoriaCreate.emit(resp.product_categorie);//client_segment del controller store
        this.modal.close();
      }

    })
  }

}
