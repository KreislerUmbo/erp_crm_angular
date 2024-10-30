import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { SucursalDeliveriesComponent } from './sucursal-deliveries/sucursal-deliveries.component';

import { MethodPaymentsModule } from './method-payments/method-payments.module';
import { ClientSegmentsModule } from './client-segments/client-segments.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProvidersModule } from './providers/providers.module';
import { UnitsModule } from './units/units.module';



@NgModule({
  declarations: [
    SucursalDeliveriesComponent,
    
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,

    SucursalesModule,
    WarehousesModule,
    MethodPaymentsModule,
    ClientSegmentsModule,
    ProductCategoriesModule,
    ProvidersModule,
    UnitsModule,
    

  ]
})
export class ConfigurationModule { }
