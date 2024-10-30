import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitsRoutingModule } from './units-routing.module';
import { UnitsComponent } from './units.component';
import { CreateUnitComponent } from './create-unit/create-unit.component';
import { EditUnitComponent } from './edit-unit/edit-unit.component';
import { DeleteUnitComponent } from './delete-unit/delete-unit.component';
import { ListUnitComponent } from './list-unit/list-unit.component';
import { CreateTransformsUnitComponent } from './create-transforms-unit/create-transforms-unit.component';
import { DeleteTransformsUnitComponent } from './delete-transforms-unit/delete-transforms-unit.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    UnitsComponent,
    CreateUnitComponent,
    EditUnitComponent,
    DeleteUnitComponent,
    ListUnitComponent,
    CreateTransformsUnitComponent,
    DeleteTransformsUnitComponent
  ],
  imports: [
    CommonModule,
    UnitsRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule
  ]
})
export class UnitsModule { }
