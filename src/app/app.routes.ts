import { Routes } from '@angular/router';
import { CustomerLayoutComponent } from './components/layouts/customer-layout/customer-layout';
import { AuthLayoutComponent } from './components/layouts/auth-layout/auth-layout';
import { ProductList } from './components/features/customer/product-list/product-list';
import { ProductDetails } from './components/features/customer/product-details/product-details';
import { AddProduct } from './components/features/customer/add-product/add-product';
import { LoginComponent } from './components/features/auth/login/login';
import { SignupComponent } from './components/features/auth/signup/signup';
import { LoginSuccessComponent } from './components/features/auth/login-success/login-success';
import { UserDetailsComponent } from './components/features/user/user-details/user-details';
import { ForgotPasswordComponent } from './components/features/auth/forgot-password/forgot-password';
import { ConfirmOrder } from './components/features/customer/confirm-order/confirm-order';
import { UserOrders } from './components/features/customer/user-orders/user-orders';

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
      { path: 'confirm-order', component: ConfirmOrder, title: 'Confirm Order' },
       { path: 'user-orders', component: UserOrders, title: 'My Orders' },
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
  { path: '**', redirectTo: 'LoginSuccess' },
];
