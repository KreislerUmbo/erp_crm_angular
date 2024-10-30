import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MethodPaymentService } from '../service/method-payment.service';
import { CreateMethodPaymentComponent } from '../create-method-payment/create-method-payment.component';
import { EditMethodPaymentComponent } from '../edit-method-payment/edit-method-payment.component';
import { DeleteMethodPaymentComponent } from '../delete-method-payment/delete-method-payment.component';

@Component({
  selector: 'app-list-method-payment',
  templateUrl: './list-method-payment.component.html',
  styleUrls: ['./list-method-payment.component.scss']
})
export class ListMethodPaymentComponent {

  METHOD_PAYMENT: any = [];
  search: string = '';
  METODOPAGOS: any = [];//para reoger el array de la lista y enviarle al html
  isLoading$: any;
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(
    public modalService: NgbModal,
    public methodPaymentService: MethodPaymentService,
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.methodPaymentService.isLoading$;
    this.listMethodPago()
  }

  listMethodPago(page = 1) {
    this.methodPaymentService.listMethodPago(page, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.METODOPAGOS = resp.method_payments;// method_payments-> es el nombbre debe ser igual al que se puso en index de laravel
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event: any) {
    this.listMethodPago($event)
  }

  createMethodPago() {
    const modalRef = this.modalService.open(CreateMethodPaymentComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.METHOD_PAYMENTS = this.METODOPAGOS.filter((method: any)=> !method.method_payment_id);
    
    modalRef.componentInstance.MethodPagoC.subscribe((method_payments: any) => {
      this.METODOPAGOS.unshift(method_payments);
    })
  }

  editMethodPago(METODOPAGO: any) {

    const modalRef = this.modalService.open(EditMethodPaymentComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.METHOD_PAYMENTS_SELECTED = METODOPAGO;
    modalRef.componentInstance.METHOD_PAYMENTS = this.METODOPAGOS.filter((method: any)=> !method.method_payment_id);

    modalRef.componentInstance.MethodPagoE.subscribe((method_payments: any) => {
      let INDEX = this.METODOPAGOS.findIndex((method_payment: any) => method_payment.id == METODOPAGO.id);
      if (INDEX != -1) {
        this.METODOPAGOS[INDEX] = method_payments;
      } 
    })
  }

  deleteMethodPago(METODOPAGO: any){
    const modalRef = this.modalService.open(DeleteMethodPaymentComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.METHOD_PAYMENTS_SELECTED = METODOPAGO;

    modalRef.componentInstance.MethodPagoD.subscribe((method_payment: any) => {
      let INDEX = this.METODOPAGOS.findIndex((method_payment: any) => method_payment.id == METODOPAGO.id);
      if (INDEX != -1) {
        this.METODOPAGOS.splice(INDEX,1);
      } 
    })
  }


}
