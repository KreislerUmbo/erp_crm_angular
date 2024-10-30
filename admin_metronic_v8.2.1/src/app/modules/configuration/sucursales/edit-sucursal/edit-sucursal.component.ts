import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SucursalService } from '../service/sucursal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-sucursal',
  templateUrl: './edit-sucursal.component.html',
  styleUrls: ['./edit-sucursal.component.scss']
})
export class EditSucursalComponent {
  
  @Output() SucursalE: EventEmitter<any> = new EventEmitter();
  @Input() SUCURSAL_SELECTED:any;
  name: string = '';
  address: string = '';
  state:number=1;
  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public sucursalService: SucursalService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.name=this.SUCURSAL_SELECTED.name;
    this.address=this.SUCURSAL_SELECTED.address;
    this.state=this.SUCURSAL_SELECTED.state;
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
      state:this.state,
    }
    this.sucursalService.updateSucursal(this.SUCURSAL_SELECTED.id,data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "La Sucursal se Registró Correctamente");
        this.SucursalE.emit(resp.sucursal);
        this.modal.close();
      }

    })
  }


}
