import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductWarehousesService } from '../../service/product-warehouses.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-warehouse-product',
  templateUrl: './edit-warehouse-product.component.html',
  styleUrls: ['./edit-warehouse-product.component.scss']
})
export class EditWarehouseProductComponent {

  @Output() WarehouseEdit: EventEmitter<any> = new EventEmitter();
  @Input() WAREHOUSES_PRODUCT: any;
  @Input() UNITS: any = [];
  @Input() WAREHOUSES: any = [];

  isLoading: any;

  unit_warehouse: string = '';
  almacen_warehouse: string = '';
  cant_warehouse: number = 0;

  constructor(
    public modal: NgbActiveModal,
    public productWarehouseService: ProductWarehousesService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.unit_warehouse=this.WAREHOUSES_PRODUCT.unit.id;
    this.almacen_warehouse=this.WAREHOUSES_PRODUCT.warehouse.id;
    this.cant_warehouse=this.WAREHOUSES_PRODUCT.quantity;
  }


  store() {

    let data = {
      unit_id:this.unit_warehouse,
      warehouse_id:this.almacen_warehouse,
      quantity:this.cant_warehouse,
    }
    this.productWarehouseService.updateProductWarehouse(this.WAREHOUSES_PRODUCT.id, data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "La Existencia del producto ha sido editada correctamente");
        this.WarehouseEdit.emit(resp.product_warehouse);
        this.modal.close();
      }

    })
  }

}
