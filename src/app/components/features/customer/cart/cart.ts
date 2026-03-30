import { Component, inject } from '@angular/core';
import { CartService } from '../../../../services/cart';
import { CartModel } from '../../../../models/cart';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true, 
  imports: [CommonModule , RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})

export class Cart {
  CartService = inject(CartService);
  cartdata: CartModel | null = null;
  recipetData: any = null;

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.CartService.getCart().subscribe({
      next: (response) => {
        this.cartdata = response.data;
      },
      error: (error) => {
        console.error('Error fetching cart data:', error);
      }
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    this.CartService.updateQuantity(productId, quantity).subscribe({
      next: (response) => {
        this.cartdata = response.data;
        //this.loadCart();
      },
      error: (error) => {
        console.error('Error updating cart item', error);
      }
    })
  }

  
  increaseQuantityByOne(productId: string): void {
    let productQuantity = this.cartdata?.items.find(item => item.product._id === productId)?.quantity || 0;
    this.updateQuantity(productId, productQuantity + 1);
  }

  decreaseQuantityByOne(productId: string): void {
    let productQuantity = this.cartdata?.items.find(item => item.product._id === productId)?.quantity || 0;
    this.updateQuantity(productId, productQuantity - 1);
  }

  removeItem(productId: string): void {
    this.CartService.removeItem(productId).subscribe({
      next: (response) => {
        this.cartdata = response.data;
        //this.loadCart();
      },
      error: (error) => {
        console.error('Error removing cart item', error);
      }
    })
  }

  isItemInCart(productId: string): void {
    this.CartService.isItemInCart(productId).subscribe({
      next: (response) => {
        return response.isExist;
      },
      error: (error) => {
        console.error('Error checking if item is in cart', error);
      }
    })
  }

  getRecipet(): void {
    this.CartService.getRecipet().subscribe({
      next: (response) => {
        this.recipetData = response.data;
        console.log('Receipt data:', response.data);
      },
      error: (error) => {
        console.error('Error fetching receipt data', error);
      }
    })
  }

  checkout(): void {
    this.CartService.checkout().subscribe({
      next: (response) => {
        this.cartdata = null;
        console.log('Checkout successful, receipt data:', response.data);
      },
      error: (error) => {
        console.error('Error during checkout', error);
      }
    })
  }
}