import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  //PARA SUCURSALES
  {
    path: 'sucursales',
    loadChildren: () => import('./sucursales/sucursales.module').then((m) => m.SucursalesModule),
  },
  //PARA ALMACENES
  {
    path: 'almacenes',
    loadChildren: () => import('./warehouses/warehouses.module').then((m) => m.WarehousesModule),
  },
  //PARA LUGAR DE ENTREGAR
  {
    path: 'lugar-de-entrega',
    loadChildren: () => import('./sucursal-deliveries/sucursal-deliveries.module').then((m) => m.SucursalDeliveriesModule),
  },
  //PARA LUGAR DE METODOS DE PAGO
  {
    path: 'metodo-de-pago',
    loadChildren: () => import('./method-payments/method-payments.module').then((m) => m.MethodPaymentsModule),
  },
  //PARA SEGMENTO DE CLIENTES
  {
    path: 'segmento-cliente',
    loadChildren: () => import('./client-segments/client-segments.module').then((m) => m.ClientSegmentsModule),
  },
  //PARA SCATEGORIA DE PRODUCTOS
  {
    path: 'categoria',
    loadChildren: () => import('./product-categories/product-categories.module').then((m) => m.ProductCategoriesModule),
  },
    //PARA  DE PROVEEDORES
  {
    path: 'proveedor',
    loadChildren: () => import('./providers/providers.module').then((m) => m.ProvidersModule),
  },
  //PARA  DE unidades
  {
    path: 'unidades',
    loadChildren: () => import('./units/units.module').then((m) => m.UnitsModule),
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
