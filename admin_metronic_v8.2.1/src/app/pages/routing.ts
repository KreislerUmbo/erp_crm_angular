import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'builder',
    loadChildren: () => import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () => import('../modules/profile/profile.module').then((m) => m.ProfileModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'crafted/account',
    loadChildren: () => import('../modules/account/account.module').then((m) => m.AccountModule),
    // data: { layout: 'dark-header' },
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () => import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'crafted/widgets',
    loadChildren: () => import('../modules/widgets-examples/widgets-examples.module').then((m) => m.WidgetsExamplesModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'apps/chat',
    loadChildren: () => import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'apps/users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'apps/roles',
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
  },
  {
    path: 'apps/permissions',
    loadChildren: () => import('./permission/permission.module').then((m) => m.PermissionModule),
  },
  //MIS MODULOS
  {
    path: 'roles',
    loadChildren: () => import('../modules/roles/roles.module').then((m) => m.RolesModule),
  },
  //PARA USUARIOS
  {
    path: 'usuarios',
    loadChildren: () => import('../modules/users/users.module').then((m) => m.UsersModule),
  },
  //PARA  CONFIGURACIONES
  {
    path: 'configuraciones',
    loadChildren: () => import('../modules/configuration/configuration.module').then((m) => m.ConfigurationModule),
  },
  //PARA PRODUCTOS
  {
    path: 'productos',
    loadChildren: () => import('../modules/products/products.module').then((m) => m.ProductsModule),
  },

    //PARA Clientes
    {
      path: 'clientes',
      loadChildren: () => import('../modules/clients/clients.module').then((m) => m.ClientsModule),
    },
    //PARA Profromas
    {
      path: 'proformas',
      loadChildren: () => import('../modules/proformas/proformas.module').then((m) => m.ProformasModule),
    },

  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
