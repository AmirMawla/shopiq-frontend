// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-home',
//   imports: [],
//   templateUrl: './home.html',
//   styleUrl: './home.css',
// })
// export class Home {}

import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../../models/product';
import { Category } from '../../../../models/category';
import { Banner } from '../../../../models/banner';
import { ProductService } from '../../../../services/product';
import { CategoriesS } from '../../../../services/category';
import {BannerService} from '../../../../services/banner';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../../../services/cart';
import { ProductCardComponent } from '../../../shared/product-card/product-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoriesS);
  private bannerService = inject(BannerService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  recentProducts: Product[] = [];
  categories: Category[] = [];
  favoritedIds: Set<string> = new Set();
  cartQty = new Map<string, number>();
  banners: Banner[] = [ {
    title: 'New Arrivals',
    imageUrl: 'https://placehold.co/1200x400/7C6EF5/ffffff?text=New+Arrivals',
    link: '/products'
  },
  {
    title: 'Special Offers',
    imageUrl: 'https://placehold.co/1200x400/22C78A/ffffff?text=Special+Offers',
    link: '/products'
  },
  {
    title: 'Best Sellers',
    imageUrl: 'https://placehold.co/1200x400/E84040/ffffff?text=Best+Sellers',
    link: '/products'
  }];
  activeBanner = 0;

  // ngOnInit(): void {
  //   this.productService.getAllProducts().subscribe({
  //     next: (data) => this.recentProducts = data.slice(0, 6),
  //     error: (err) => console.log(err)
  //   });

  //   this.categoryService.getAllCategories().subscribe({
  //     next: (data) => this.categories = data,
  //     error: (err) => console.log(err)
  //   });

    // this.bannerService.getActiveBanners().subscribe({
    //   next: (data) => this.banners = data,
    //   error: (err) => console.log(err)
    // });
   ngOnInit(): void {

  this.productService.getAllProducts().subscribe({
    next: (res) => {
      this.recentProducts = res.data.slice(0, 6);
      this.cdr.detectChanges();
    },
    error: (err) => console.log(err)
  });

  this.categoryService.getAllCategories().subscribe({
    next: (res) => this.categories = res.data,
    error: (err) => console.log(err)
  });

  this.bannerService.getActiveBanners().subscribe({
    next: (data) => {
      if (data.length > 0) {
        this.banners = data;
      }
    },
    error: (err) => console.log(err)
  });

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
    const token = localStorage.getItem('token');
    if (!token) return;
    this.productService.getMyFavorites().subscribe({
      next: (res) => {
        const favs = res.data || [];
        this.favoritedIds = new Set(favs.map((f: any) => f.productId?._id));
        this.cdr.detectChanges();
      }
    });
  }

  isProductFavorited(id: string): boolean {
    return this.favoritedIds.has(id);
  }

  filterByCategory(categoryId: string): void {
    this.router.navigate(['/products'], { 
      queryParams: { categoryId } 
    });
  }

  nextBanner(): void {
    this.activeBanner = (this.activeBanner + 1) % this.banners.length;
  }

  prevBanner(): void {
    this.activeBanner = (this.activeBanner - 1 + this.banners.length) % this.banners.length;
  }
}