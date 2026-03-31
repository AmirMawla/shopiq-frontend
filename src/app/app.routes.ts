import { Routes } from '@angular/router';
import { CustomerLayoutComponent } from './components/layouts/customer-layout/customer-layout';
import { AuthLayoutComponent } from './components/layouts/auth-layout/auth-layout';
import { AdminLayoutComponent } from './components/layouts/admin-layout/admin-layout';
import { SellerLayoutComponent } from './components/layouts/seller-layout/seller-layout';
import { ProductList } from './components/features/customer/product-list/product-list';
import { ProductDetails } from './components/features/customer/product-details/product-details';
import { AddProduct } from './components/features/customer/add-product/add-product';
import { LoginComponent } from './components/features/auth/login/login';
import { SignupComponent } from './components/features/auth/signup/signup';
import { LoginSuccessComponent } from './components/features/auth/login-success/login-success';
import { UserDetailsComponent } from './components/features/user/user-details/user-details';
import { ForgotPasswordComponent } from './components/features/auth/forgot-password/forgot-password';
import { ADMIN_ROUTES } from './components/features/admin/admin.routes';
import { SELLER_ROUTES } from './components/features/seller/seller.routes';

export const routes: Routes = [
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: ProductList, title: 'Products' },
      { path: 'products/:id', component: ProductDetails, title: 'Product Details' },
      { path: 'products/add', component: AddProduct, title: 'Add Product' },
      { path: 'products/edit/:id', component: AddProduct, title: 'Edit Product' },
      { path: 'account/profile', component: UserDetailsComponent, title: 'My Profile' },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent, title: 'Login' },
      { path: 'signup', component: SignupComponent, title: 'Signup' },
      { path: 'login-success', component: LoginSuccessComponent, title: 'LoginSuccess' },
      { path: 'forgot-password', component: ForgotPasswordComponent, title: 'Forgot Password' },
    ],
  },
{
    path: 'admin',
    component: AdminLayoutComponent,
    children: ADMIN_ROUTES,
  },
  {
    path: 'seller',
    component: SellerLayoutComponent,
    children: SELLER_ROUTES,
  },
  { path: '**', redirectTo: 'LoginSuccess' },
];
