import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { MethodPaymentService } from '../service/method-payment.service';

@Component({
  selector: 'app-delete-method-payment',
  templateUrl: './delete-method-payment.component.html',
  styleUrls: ['./delete-method-payment.component.scss']
})
export class DeleteMethodPaymentComponent {
  
  @Output() MethodPagoD: EventEmitter<any> = new EventEmitter();//enviamos  mediante output a la list-warehouse.component.ts metodo deletewherehouse 
  @Input() METHOD_PAYMENTS_SELECTED: any;


  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public methodPaymentService: MethodPaymentService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }


  delete() {
    this.methodPaymentService.deleteMethodPago(this.METHOD_PAYMENTS_SELECTED.id).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "EL METODO DE PAGO SE HA  ELIMINADO CORRECTAMENTE");
        this.MethodPagoD.emit(resp.message); //PUEDE SER la resp en message o warehouse
        this.modal.close();
      }

    })
  }

}
