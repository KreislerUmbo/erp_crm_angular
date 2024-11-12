import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductWarehousesService } from '../../service/product-warehouses.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-warehouse-product',
  templateUrl: './delete-warehouse-product.component.html',
  styleUrls: ['./delete-warehouse-product.component.scss']
})
export class DeleteWarehouseProductComponent {

  @Output() WarehouseDelete: EventEmitter<any> = new EventEmitter();
  @Input() WAREHOUSES_PROD: any;
  isLoading: any;
  
  constructor(
    public modal: NgbActiveModal,
    public productWarehousesService: ProductWarehousesService,
    public toast: ToastrService,
  ) {

  }
  ngOnInit(): void {

  }
  delete() {
    this.productWarehousesService.deleteProductWarehouse(this.WAREHOUSES_PROD.id).subscribe((resp: any) => {
      console.log();
      if (resp.message == 403) {
        this.toast.error("Validación", resp.message_text);
      } else {
        this.toast.success("Exito", "El precio del prodcto se eliminó correctamente");
        this.WarehouseDelete.emit(resp.message);
        this.modal.close();
      }
    })
  }

}
