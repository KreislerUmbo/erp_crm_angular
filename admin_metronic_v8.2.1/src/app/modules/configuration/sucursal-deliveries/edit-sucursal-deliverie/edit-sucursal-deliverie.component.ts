import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SucursalDeliverieService } from '../service/sucursal-deliverie.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-sucursal-deliverie',
  templateUrl: './edit-sucursal-deliverie.component.html',
  styleUrls: ['./edit-sucursal-deliverie.component.scss']
})
export class EditSucursalDeliverieComponent {
  
  @Output() SucursalDeliverieE: EventEmitter<any> = new EventEmitter();
  @Input() SUCURSAL_DELIVERIE_SELECTED:any;
  name: string = '';
  address: string = '';
  state:number=1;
  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public sucursalDliverieService: SucursalDeliverieService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.name=this.SUCURSAL_DELIVERIE_SELECTED.name;
    this.address=this.SUCURSAL_DELIVERIE_SELECTED.address;
    this.state=this.SUCURSAL_DELIVERIE_SELECTED.state;
  }


  store() {
    if (!this.name) {
      this.toast.error("Validacion:", "EL NOMBRE DE LA SUCURSAL ES REQUERIDO");
      return false;
    }


    let data = {
      name: this.name,
      address: this.address,
      state:this.state,
    }
    this.sucursalDliverieService.updateSucursalDeliverie(this.SUCURSAL_DELIVERIE_SELECTED.id,data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "El Lugar de Trabajo se Registró Correctamente");
        this.SucursalDeliverieE.emit(resp.sucursal_deliverie);
        this.modal.close();
      }

    })
  }

}
