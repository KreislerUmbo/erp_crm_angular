import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { WarehouseService } from '../service/warehouse.service';

@Component({
  selector: 'app-create-warehouse',
  templateUrl: './create-warehouse.component.html',
  styleUrls: ['./create-warehouse.component.scss']
})
export class CreateWarehouseComponent {


  @Output() WarehouseC: EventEmitter<any> = new EventEmitter();
  @Input() SUCURSALES:any=[];
  name: string = '';
  address: string = '';
  sucursale_id: string = '';


  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public warehouseService: WarehouseService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }


  store() {
    if (!this.name) {
      this.toast.error("Validacion:", "EL NOMBRE DEL ALMACÉN ES OBLIGATORIO");
      return false;
    }
    if (!this.address) {
      this.toast.error("Validacion:", "LA DIRECION DE LA ALMACÉN ES OBLIGATORIO");
      return false;
    }

    let data = {
      name: this.name,
      address: this.address,
      sucursale_id: this.sucursale_id,
    }
    this.warehouseService.registerWarehouse(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "El Almacén se Registró Correctamente");
        this.WarehouseC.emit(resp.warehouse);
        this.modal.close();
      }

    })
  }


}
