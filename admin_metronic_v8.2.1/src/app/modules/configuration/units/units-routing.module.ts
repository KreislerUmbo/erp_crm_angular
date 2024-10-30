import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitsComponent } from './units.component';
import { ListUnitComponent } from './list-unit/list-unit.component';

const routes: Routes = [
  {
    path: '',
    component: UnitsComponent,
    children: [
      {
        path: 'list',
        component: ListUnitComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitsRoutingModule { }
