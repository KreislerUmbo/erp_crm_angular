import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MethodPaymentService } from '../service/method-payment.service';

@Component({
  selector: 'app-edit-method-payment',
  templateUrl: './edit-method-payment.component.html',
  styleUrls: ['./edit-method-payment.component.scss']
})
export class EditMethodPaymentComponent {

  @Output() MethodPagoE: EventEmitter<any> = new EventEmitter();
  @Input() METHOD_PAYMENTS_SELECTED:any;
  @Input() METHOD_PAYMENTS: any = [];

  codigo: string = '';
  name: string = '';
  method_payment_id: string = '';
  state:number=1;
  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public methoPagoService: MethodPaymentService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.codigo=this.METHOD_PAYMENTS_SELECTED.codigo;
    this.name=this.METHOD_PAYMENTS_SELECTED.name;
    this.method_payment_id=this.METHOD_PAYMENTS_SELECTED.method_payment_id;
    this.state=this.METHOD_PAYMENTS_SELECTED.state;
  }


  store() {
    if (!this.name) {
      this.toast.error("Validacion:", "EL NOMBRE DEL METODO DE PAGO ES OBLIGATORIO");
      return false;
    }


    let data = {
      codigo: this.codigo,
      name: this.name,
      method_payment_id: this.method_payment_id,
      state:this.state,
    }
    this.methoPagoService.updateMethodPago(this.METHOD_PAYMENTS_SELECTED.id,data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "El Metdo de Pago se Modifico Correctamente");
        this.MethodPagoE.emit(resp.method_payment);
        this.modal.close();
      }

    })
  }

}
