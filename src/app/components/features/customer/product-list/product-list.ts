import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../../models/product';
import { Category } from '../../../../models/category';
import { ProductService } from '../../../../services/product';
import { CategoriesS } from '../../../../services/category';
import { CartService } from '../../../../services/cart';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../../../shared/product-card/product-card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, ProductCardComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoriesS);
  private cartService = inject(CartService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private activatedRoute = inject(ActivatedRoute);

  products: Product[] = [];
  categories: Category[] = [];
  favoritedIds: Set<string> = new Set();
  /** productId → qty in cart */
  cartQty = new Map<string, number>();
  loading = true;
  errorMessage: string | null = null;

  selectedCategoryId: string = '';
  searchQuery: string = '';
  maxPrice: number = 0;

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.loadFavorites();
    this.syncCart();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['categoryId']) {
        this.selectedCategoryId = params['categoryId'];
        this.filterByCategory(this.selectedCategoryId);
      }
    });
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
      },
    });
  }

  isProductFavorited(id: string): boolean {
    return this.favoritedIds.has(id);
  }

  applyFilters(): void {
    const hasSearch = !!this.searchQuery?.trim();
    const hasCategory = !!this.selectedCategoryId;
    const hasMaxPrice = !!this.maxPrice && this.maxPrice > 0;

    if (hasSearch) {
      this.loadProductsRequest(this.productService.searchProducts(this.searchQuery.trim()));
      return;
    }

    if (hasCategory) {
      this.loadProductsRequest(this.productService.getProductsByCatId(this.selectedCategoryId));
      return;
    }

    if (hasMaxPrice) {
      this.loadProductsRequest(this.productService.getProductsByPrice(this.maxPrice));
      return;
    }

    this.loadProductsRequest(this.productService.getAllProducts());
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = Array.isArray(res.data) ? res.data : [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.categories = [];
        this.cdr.detectChanges();
      },
    });
  }

  private loadProductsRequest(req: any): void {
    this.loading = true;
    this.errorMessage = null;
    this.cdr.detectChanges();

    req.subscribe({
      next: (res: any) => {
        this.products = Array.isArray(res.data) ? res.data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.products = [];
        this.loading = false;
        this.errorMessage = 'Failed to load products.';
        this.cdr.detectChanges();
      },
    });
  }

  private loadProducts(): void {
    this.loadProductsRequest(this.productService.getAllProducts());
  }

  filterByCategory(catId: string): void {
    if (!catId) {
      this.loadProductsRequest(this.productService.getAllProducts());
    } else {
      this.loadProductsRequest(this.productService.getProductsByCatId(catId));
    }
  }

  searchProducts(): void {
    if (!this.searchQuery) {
      this.loadProductsRequest(this.productService.getAllProducts());
    } else {
      this.loadProductsRequest(this.productService.searchProducts(this.searchQuery));
    }
  }

  filterByPrice(): void {
    if (!this.maxPrice || this.maxPrice <= 0) {
      this.loadProductsRequest(this.productService.getAllProducts());
    } else {
      this.loadProductsRequest(this.productService.getProductsByPrice(this.maxPrice));
    }
  }
}
