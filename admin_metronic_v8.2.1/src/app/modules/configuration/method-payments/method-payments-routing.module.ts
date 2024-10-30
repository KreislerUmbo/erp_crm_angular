import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MethodPaymentsComponent } from './method-payments.component';
import { ListMethodPaymentComponent } from './list-method-payment/list-method-payment.component';

const routes: Routes = [
  {
  path: '',
  component: MethodPaymentsComponent,
  children: [
    {
      path: 'list',
     component: ListMethodPaymentComponent
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MethodPaymentsRoutingModule { }
