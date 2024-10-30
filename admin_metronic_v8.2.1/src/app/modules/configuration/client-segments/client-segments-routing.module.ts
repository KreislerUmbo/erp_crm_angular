import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientSegmentsComponent } from './client-segments.component';
import { ListClientSegmentComponent } from './list-client-segment/list-client-segment.component';

const routes: Routes = [
  {
    path: '',
    component: ClientSegmentsComponent,
    children: [
      {
        path: 'list',
        component: ListClientSegmentComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientSegmentsRoutingModule { }
