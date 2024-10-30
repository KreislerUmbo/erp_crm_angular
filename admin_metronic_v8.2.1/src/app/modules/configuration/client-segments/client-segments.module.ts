import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientSegmentsRoutingModule } from './client-segments-routing.module';
import { ClientSegmentsComponent } from './client-segments.component';
import { CreateClientSegmentComponent } from './create-client-segment/create-client-segment.component';
import { EditClientSegmentComponent } from './edit-client-segment/edit-client-segment.component';
import { DeleteClientSegmentComponent } from './delete-client-segment/delete-client-segment.component';
import { ListClientSegmentComponent } from './list-client-segment/list-client-segment.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    ClientSegmentsComponent,
    CreateClientSegmentComponent,
    EditClientSegmentComponent,
    DeleteClientSegmentComponent,
    ListClientSegmentComponent
  ],
  imports: [
    CommonModule,
    ClientSegmentsRoutingModule,
    
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class ClientSegmentsModule { }
