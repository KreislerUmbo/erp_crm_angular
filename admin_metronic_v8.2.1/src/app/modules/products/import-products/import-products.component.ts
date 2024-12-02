import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { event } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../service/products.service';

@Component({
  selector: 'app-import-products',
  templateUrl: './import-products.component.html',
  styleUrls: ['./import-products.component.scss']
})
export class ImportProductsComponent {

  @Output() ImportProductExcel: EventEmitter<any> = new EventEmitter();

  isLoading: any;
  file_excel: any;

  constructor(
    public modal: NgbActiveModal,
    public productsService: ProductsService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }

  processFileExcel($event: any) {
    this.file_excel = $event.target.files[0];
  }

  store() {
    if (!this.file_excel) {
      this.toast.error("Validacion:", "EL ARCHIVO ES  OBLIGATORIO");
      return false;
    }


    let formData = new FormData();
    formData.append("import_file", this.file_excel);
    this.productsService.importProduct(formData).subscribe((resp: any) => {
      console.log(resp);
      this.toast.success("Exito", "Los productos han sido importados correctamente");
      this.ImportProductExcel.emit(resp.message);
      this.modal.close();
    }, error => {
      console.log(error);
    })
  }

}
