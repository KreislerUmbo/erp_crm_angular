import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProductCategorieService } from '../service/product-categorie.service';

@Component({
  selector: 'app-delete-product-categorie',
  templateUrl: './delete-product-categorie.component.html',
  styleUrls: ['./delete-product-categorie.component.scss']
})
export class DeleteProductCategorieComponent {

  @Output() CategoriaDelete: EventEmitter<any> = new EventEmitter();
  @Input() CATEGORIA_SELECTED: any;

  name: string = '';
  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public productCategorieService: ProductCategorieService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }


  delete() {
    this.productCategorieService.deleteCategorieProduct(this.CATEGORIA_SELECTED.id).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "El usuario se Eliminó Correctamente");
        this.CategoriaDelete.emit(resp.product_categorie);
        this.modal.close();
      }

    })
  }


}
