import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProformasRoutingModule } from './proformas-routing.module';
import { ProformasComponent } from './proformas.component';
import { CreateProformaComponent } from './create-proforma/create-proforma.component';
import { EditProformaComponent } from './edit-proforma/edit-proforma.component';
import { ListProformasComponent } from './list-proformas/list-proformas.component';
import { DeleteProformasComponent } from './delete-proformas/delete-proformas.component';
import { SearchProductsComponent } from './components/search-products/search-products.component';
import { SearchClientsComponent } from './components/search-clients/search-clients.component';
import { AddPagosComponent } from './components/add-pagos/add-pagos.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { EditProductDetailProformaComponent } from './components/edit-product-detail-proforma/edit-product-detail-proforma.component';
import { DeleteProductDetailProformaComponent } from './components/delete-product-detail-proforma/delete-product-detail-proforma.component';


@NgModule({
  declarations: [
    ProformasComponent,
    CreateProformaComponent,
    EditProformaComponent,
    ListProformasComponent,
    DeleteProformasComponent,
    SearchProductsComponent,
    SearchClientsComponent,
    AddPagosComponent,
    EditProductDetailProformaComponent,
    DeleteProductDetailProformaComponent
  ],
  imports: [
    CommonModule,
    ProformasRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class ProformasModule { }
