import { Routes } from '@angular/router';
import { CustomerLayoutComponent } from './components/layouts/customer-layout/customer-layout';
import { AuthLayoutComponent } from './components/layouts/auth-layout/auth-layout';
import { ProductList } from './components/features/customer/product-list/product-list';
import { ProductDetails } from './components/features/customer/product-details/product-details';
import { AddProduct } from './components/features/customer/add-product/add-product';
import { Cart } from './components/features/customer/cart/cart';
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
      { path: 'cart', component: Cart, title: 'Shopping Cart' },
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      // Uncomment when Login and Signup components are created
      // { path: 'login', component: Login, title: 'Login' },
      // { path: 'signup', component: Signup, title: 'Signup' },
    ]
  },
  { path: '**', redirectTo: 'products' }
];