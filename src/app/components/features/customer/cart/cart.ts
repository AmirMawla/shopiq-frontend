import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../../services/cart';
import { CartItemModel, CartModel, RecieptModel } from '../../../../models/cart';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/product';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { map, filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-cart',
  standalone: true, 
  imports: [CommonModule , RouterLink,FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})

export class Cart implements OnInit, OnDestroy {
  CartService = inject(CartService);
  ProductService = inject(ProductService);
  ChangeDetectorRef = inject(ChangeDetectorRef);
  Router = inject(Router);
  cartdata: CartModel  | null | undefined = null;
  recipetData: any = null;
  private routerSubscription: Subscription | undefined;
  promoCode: string = '';
  ngOnInit() {
    
    this.routerSubscription = this.Router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadCart();
      });

    this.loadCart();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadCart() {
    this.CartService.getCart().subscribe({
      next: (response) => {
        this.cartdata = response.cart as CartModel;
        this.ChangeDetectorRef.detectChanges();
      },
      error: (error) => console.error('Error fetching cart:', error)
    });
  }
  
  /*
  loadCart() {
    this.CartService.getCart().subscribe({
      next: (response) => {
        const cart = response.cart as CartModel;
        //this.cartdata = cart;
        this.cartdata = cart;
        console.log('Cart data (initial):', cart);

        const productRequests = (cart.items || []).map((item) => {
          const id = typeof item.productId === 'string' ? item.productId : (item.productId as any)?._id;
          return this.ProductService.getProductById(id as string);
        });

        if (productRequests.length > 0) {
          (forkJoin(productRequests) as Observable<Product[]>).subscribe({
            next: (products: Product[]) => {
              this.cartdata!.items = this.cartdata!.items.map((item: CartItemModel, index: number) => ({
                ...item,
                product: products[index]
              }));
              console.log('Cart data with products attached:', this.cartdata);
              this.ChangeDetectorRef.detectChanges();
            },
            error: (err) => console.error('Error fetching products:', err)
          });
        }
        this.ChangeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching cart data:', error);
      }
    });
  }
*/

 

  updateQuantity(productId: string, quantity: number): void {
    this.CartService.updateQuantity(productId, quantity).subscribe({
      next: (response) => {
        const cart = response.cart as CartModel;
        this.cartdata = cart;
        this.ChangeDetectorRef.detectChanges();
        this.loadCart();
        this.applyPromoCode(this.promoCode);
      },
      error: (error) => {
        console.error('Error updating cart item', error);
        this.ChangeDetectorRef.detectChanges();
      }
    })
  }

  
  increaseQuantityByOne(productId: string): void {
    let productQuantity = this.cartdata?.items.find(item => item.productId._id === productId)?.quantity || 0;
    this.updateQuantity(productId, productQuantity + 1);
    
  }

  decreaseQuantityByOne(productId: string): void {
    let productQuantity = this.cartdata?.items.find(item => item.productId._id === productId)?.quantity || 0;
    this.updateQuantity(productId, productQuantity - 1);
  }

  removeItem(productId: string): void {
    this.CartService.removeItem(productId).subscribe({
      next: (response) => {
        this.cartdata = response.cart;
        this.ChangeDetectorRef.detectChanges();
        this.loadCart();
        this.applyPromoCode(this.promoCode);
      },
      error: (error) => {
        console.error('Error removing cart item', error);
        this.ChangeDetectorRef.detectChanges();
      }
    })
  }

  isItemInCart(productId: string): void {
    this.CartService.isItemInCart(productId).subscribe({
      next: (response) => {
        return response.isExist;
        this.ChangeDetectorRef.detectChanges();
        this.loadCart()
      },
      error: (error) => {
        console.error('Error checking if item is in cart', error);
        this.ChangeDetectorRef.detectChanges();
      }
    })
  }

  getRecipet(): void {
    this.CartService.getRecipet().subscribe({
      next: (response) => {
        const receipt = response as RecieptModel;
        this.recipetData = receipt;
        console.log('Receipt data:', response);
        this.ChangeDetectorRef.detectChanges();
        this.loadCart()
      },
      error: (error) => {
        console.error('Error fetching receipt data', error);
        this.ChangeDetectorRef.detectChanges();
      }
    })
  }

  checkout(): void {
    this.CartService.checkout().subscribe({
      next: (response) => {
        this.cartdata = null;
        console.log('Checkout successful, receipt data:', response.data);
        this.ChangeDetectorRef.detectChanges();
        this.loadCart()
      },
      error: (error) => {
        console.error('Error during checkout', error);
        this.ChangeDetectorRef.detectChanges();
      }
    })
  }

  applyPromoCode(promoCode: string): void {
    this.CartService.applyPromoCode(promoCode).subscribe({
      next: (response) => {
        this.cartdata = response.cart as CartModel;
        console.log('Promo code applied successfully, updated cart data:', response.cart);
        this.ChangeDetectorRef.detectChanges();
        this.loadCart()
      },
      error: (error) => {
        console.error('Error applying promo code', error);
        this.ChangeDetectorRef.detectChanges();
      }
    })
  }

  asProduct(productId: string | Product): Product {
  return productId as Product;
  }

  printCart(): void {
    console.log('Current cart data:', this.cartdata);
  }

 
}