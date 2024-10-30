import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SucursalService } from '../service/sucursal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-sucursal',
  templateUrl: './create-sucursal.component.html',
  styleUrls: ['./create-sucursal.component.scss']
})
export class CreateSucursalComponent {


  @Output() SucursalC: EventEmitter<any> = new EventEmitter();
  name: string = '';
  address: string = '';

  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public sucursalService: SucursalService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }


  store() {
    if (!this.name) {
      this.toast.error("Validacion:", "EL NOMBRE DE LA SUCURSAL ES REQUERIDO");
      return false;
    }
    if (!this.address) {
      this.toast.error("Validacion:", "LA DIRECION DE LA SUCURSAL ES OBLIGATORIO");
      return false;
    }

    let data = {
      name: this.name,
      address: this.address,
    }
    this.sucursalService.registerSucursal(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "La Sucursal se Registró Correctamente");
        this.SucursalC.emit(resp.sucursal);
        this.modal.close();
      }

    })
  }

}
