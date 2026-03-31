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
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: Dashboard,
    title: 'Admin Dashboard',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'users',
    component: Users,
    title: 'Users',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'products',
    component: Products,
    title: 'Products',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'categories',
    component: Categories,
    title: 'Categories',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'orders',
    component: Orders,
    title: 'Orders',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'banners',
    component: Banners,
    title: 'Banners',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
];
