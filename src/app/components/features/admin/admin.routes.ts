import { Routes } from '@angular/router';
import { authGuard } from '../../../guards/auth-guard';
import { roleGuard } from '../../../guards/role-guard';
import { Dashboard } from './dashboard/dashboard';
import { Users } from './users/users';
import { Products } from './products/products';
import { Categories } from './categories/categories';
import { Orders } from './orders/orders';
import { Banners } from './banners/banners';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard, title: 'Admin Dashboard' },
      { path: 'users', component: Users, title: 'Users' },
      { path: 'products', component: Products, title: 'Products' },
      { path: 'categories', component: Categories, title: 'Categories' },
      { path: 'orders', component: Orders, title: 'Orders' },
      { path: 'banners', component: Banners, title: 'Banners' },
    ]
  }
];
