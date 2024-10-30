import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductCategorieService } from '../service/product-categorie.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-product-categorie',
  templateUrl: './edit-product-categorie.component.html',
  styleUrls: ['./edit-product-categorie.component.scss']
})
export class EditProductCategorieComponent {

  @Output() CategoriaEdit: EventEmitter<any> = new EventEmitter();//sale a listproductcategorie 
  @Input() CATEGORIA_SELECTED:any; //ingresa del listproductcategorie
  name: string = '';
  state:number=1;
  image_categorie: any;
  image_previsualiza: any;
  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public productCategorieService: ProductCategorieService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.name=this.CATEGORIA_SELECTED.name;
    this.state=this.CATEGORIA_SELECTED.state;
    this.image_previsualiza=this.CATEGORIA_SELECTED.imagen //seteamos la imagena al formulalrio en imageprevsuliza

    
  }

  processFile($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
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
      this.toast.error("Validacion:", "EL NOMBRE DE LA CATEGORIA ES OBLIGATORIO");
      return false;
    }

    let formData = new FormData();
    formData.append("name", this.name);
    if (this.image_categorie) {
      formData.append("categorie_imagen", this.image_categorie); //categorie_imagen VIENE DEL CONTROLLER EN LA PARTE hasFil("categorie_imagen")
    }
    formData.append("state", this.state+"");

    this.productCategorieService.updateCategorieProduct(this.CATEGORIA_SELECTED.id,formData).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "La Categoría se Editó Correctamente");
        this.CategoriaEdit.emit(resp.product_categorie);
        this.modal.close();
      }

    })
  }
}
