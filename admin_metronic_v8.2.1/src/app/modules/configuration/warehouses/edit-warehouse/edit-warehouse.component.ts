import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WarehouseService } from '../service/warehouse.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-warehouse',
  templateUrl: './edit-warehouse.component.html',
  styleUrls: ['./edit-warehouse.component.scss']
})
export class EditWarehouseComponent {

  @Output() WarehouseE: EventEmitter<any> = new EventEmitter();
  @Input() SUCURSALES:any=[];
  @Input() WAREHOUSE_SELECTED: any;

  name: string = '';
  address: string = '';
  sucursale_id: string = '';
  state: number = 1;

  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public warehouseService: WarehouseService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.name = this.WAREHOUSE_SELECTED.name;
    this.address = this.WAREHOUSE_SELECTED.address;
    this.state = this.WAREHOUSE_SELECTED.state;
    this.sucursale_id = this.WAREHOUSE_SELECTED.sucursale_id;
  }


  store() {
    if (!this.name) {
      this.toast.error("Validacion:", "EL NOMBRE DEL ALMACÉN ES REQUERIDO");
      return false;
    }
    if (!this.address) {
      this.toast.error("Validacion:", "EL NOMBRE DEL ALMACÉN ES OBLIGATORIO");
      return false;
    }

    let data = {
      name: this.name,
      address: this.address,
      state: this.state,
      sucursale_id: this.sucursale_id,
    }

    this.warehouseService.updateWarehouse(this.WAREHOUSE_SELECTED.id, data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "El almacen se editó correctamente");
        this.WarehouseE.emit(resp.warehouse);
        this.modal.close();
      }

    })
  }


}
