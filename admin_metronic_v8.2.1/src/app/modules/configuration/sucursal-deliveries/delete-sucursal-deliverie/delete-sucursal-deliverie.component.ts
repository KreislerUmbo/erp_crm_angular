import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SucursalDeliverieService } from '../service/sucursal-deliverie.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-sucursal-deliverie',
  templateUrl: './delete-sucursal-deliverie.component.html',
  styleUrls: ['./delete-sucursal-deliverie.component.scss']
})
export class DeleteSucursalDeliverieComponent {

  @Output() SucursalDeliverieD: EventEmitter<any> = new EventEmitter();
  @Input() SUCURSAL_DELIVERIE_SELECTED: any;

  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public SucursalDeliverieService: SucursalDeliverieService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }


  delete() {
    this.SucursalDeliverieService.deleteSucursalDeliverie(this.SUCURSAL_DELIVERIE_SELECTED.id).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", " EL LUGAR DE ENTREGA HA SIDO ELIMINADO");
        this.SucursalDeliverieD.emit(resp.message); //PUEDE SER message  ootro nombbre que se trabaja
        this.modal.close();
      }

    })
  }

}
