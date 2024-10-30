import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MethodPaymentsRoutingModule } from './method-payments-routing.module';
import { MethodPaymentsComponent } from './method-payments.component';
import { CreateMethodPaymentComponent } from './create-method-payment/create-method-payment.component';
import { EditMethodPaymentComponent } from './edit-method-payment/edit-method-payment.component';
import { DeleteMethodPaymentComponent } from './delete-method-payment/delete-method-payment.component';
import { ListMethodPaymentComponent } from './list-method-payment/list-method-payment.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    MethodPaymentsComponent,
    CreateMethodPaymentComponent,
    EditMethodPaymentComponent,
    DeleteMethodPaymentComponent,
    ListMethodPaymentComponent
  ],
  imports: [
    CommonModule,
    MethodPaymentsRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class MethodPaymentsModule { }
