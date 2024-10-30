import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WarehouseService } from '../service/warehouse.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-warehouse',
  templateUrl: './delete-warehouse.component.html',
  styleUrls: ['./delete-warehouse.component.scss']
})
export class DeleteWarehouseComponent {

  
  @Output() WarehouseD: EventEmitter<any> = new EventEmitter();//enviamos WarehouseD mediante output a la list-warehouse.component.ts metodo deletewherehouse 
  @Input() WAREHOUSE_SELECTED: any;


  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public warehouseService: WarehouseService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }


  delete() {
    this.warehouseService.deleteWarehouse(this.WAREHOUSE_SELECTED.id).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "EL ALMACÉN SE HA  ELIMINADO CORRECTAMENTE");
        this.WarehouseD.emit(resp.message); //PUEDE SER la resp en message o warehouse
        this.modal.close();
      }

    })
  }


}
