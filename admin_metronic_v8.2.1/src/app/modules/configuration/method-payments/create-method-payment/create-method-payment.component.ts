import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MethodPaymentService } from '../service/method-payment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-method-payment',
  templateUrl: './create-method-payment.component.html',
  styleUrls: ['./create-method-payment.component.scss']
})
export class CreateMethodPaymentComponent {

  @Output() MethodPagoC: EventEmitter<any> = new EventEmitter();
  @Input() METHOD_PAYMENTS: any = [];
  
  name: string = '';
  method_payment_id: string = '';


  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public methoPagoService: MethodPaymentService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }


  store() {
    if (!this.name) {
      this.toast.error("Validacion:", "EL NOMBRE DEL METODO DE PAGO ES REQUERIDO");
      return false;
    }


    let data = {
      name: this.name,
      method_payment_id: this.method_payment_id,
    }
    this.methoPagoService.registerMethodPago(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "El Método de Pago se Registró Correctamente");
        this.MethodPagoC.emit(resp.method_payment);
        this.modal.close();
      }

    })
  }

}
