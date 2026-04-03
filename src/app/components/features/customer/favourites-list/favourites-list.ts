import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/product';
import { CartService } from '../../../../services/cart';
import { ProductCardComponent } from '../../../shared/product-card/product-card';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './favourites-list.html',
  styleUrl: './favourites-list.css',
})
export class FavoritesList implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  favorites: any[] = [];
  /** productId → qty in cart */
  cartQty = new Map<string, number>();
  loading = true;

  ngOnInit(): void {
    this.loadFavorites();
    this.syncCart();
  }

  syncCart(): void {
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        const m = new Map<string, number>();
        const items = res?.cart?.items || [];
        for (const it of items) {
          const pid =
            typeof it.productId === 'object' && it.productId?._id
              ? String(it.productId._id)
              : String(it.productId);
          m.set(pid, Number(it.quantity) || 0);
        }
        this.cartQty = m;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cartQty = new Map();
        this.cdr.detectChanges();
      },
    });
  }

  loadFavorites(): void {
    this.loading = true;
    this.productService.getMyFavorites().subscribe({
      next: (res) => {
        this.favorites = res.data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  asProduct(fav: any): Product {
    return fav?.productId as Product;
  }
}
