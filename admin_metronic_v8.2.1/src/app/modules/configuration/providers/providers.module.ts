import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvidersRoutingModule } from './providers-routing.module';
import { ProvidersComponent } from './providers.component';
import { CreateProviderComponent } from './create-provider/create-provider.component';
import { EditProviderComponent } from './edit-provider/edit-provider.component';
import { DeleteProviderComponent } from './delete-provider/delete-provider.component';
import { ListProviderComponent } from './list-provider/list-provider.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    ProvidersComponent,
    CreateProviderComponent,
    EditProviderComponent,
    DeleteProviderComponent,
    ListProviderComponent,
  ],
  imports: [
    CommonModule,
    ProvidersRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class ProvidersModule { }
