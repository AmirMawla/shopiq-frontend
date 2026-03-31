import { Routes } from '@angular/router';
import { authGuard } from '../../../guards/auth-guard';
import { roleGuard } from '../../../guards/role-guard';
import { Dashboard } from './dashboard/dashboard';
import { Profile } from './profile/profile';
import { Products } from './products/products';
import { LowStock,  } from './low-stock/low-stock';

export const SELLER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['seller'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard, title: 'Seller Dashboard' },
      { path: 'profile', component: Profile, title: 'My Profile' },
      { path: 'products', component: Products, title: 'My Products' },
      { path: 'low-stock', component: LowStock, title: 'Low Stock' },
    ]
  }
];
