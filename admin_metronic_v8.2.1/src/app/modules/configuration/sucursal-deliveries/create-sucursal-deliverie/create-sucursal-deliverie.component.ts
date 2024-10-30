import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SucursalDeliverieService } from '../service/sucursal-deliverie.service';

@Component({
  selector: 'app-create-sucursal-deliverie',
  templateUrl: './create-sucursal-deliverie.component.html',
  styleUrls: ['./create-sucursal-deliverie.component.scss']
})
export class CreateSucursalDeliverieComponent {
  
  @Output() SucursalDeliverieC: EventEmitter<any> = new EventEmitter();
  name: string = '';
  address: string = '';

  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public sucursalDeliverieService: SucursalDeliverieService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }


  store() {
    if (!this.name) {
      this.toast.error("Validacion:", "EL NOMBRE DEL LUGAR DE ENTREGA ES OBLIGATORIO");
      return false;
    }


    let data = {
      name: this.name,
      address: this.address,
    }
    this.sucursalDeliverieService.registerSucursalDeliverie(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "El Lugar de Trabajo se Registró Correctamente");
        this.SucursalDeliverieC.emit(resp.sucursal_deliverie);
        this.modal.close();
      }

    })
  }

}
