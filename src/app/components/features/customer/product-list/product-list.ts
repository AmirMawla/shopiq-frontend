import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../../models/product';
import { Category } from '../../../../models/category';
import { ProductService } from '../../../../services/product';
import { CategoriesS} from '../../../../services/category';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoriesS);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private activatedRoute = inject(ActivatedRoute);

  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  errorMessage: string | null = null;

  selectedCategoryId: string = '';
  searchQuery: string = '';
  maxPrice: number = 0;

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.activatedRoute.queryParams.subscribe(params => {
    if (params['categoryId']) {
      this.selectedCategoryId = params['categoryId'];
      this.filterByCategory(this.selectedCategoryId);
    }
  });
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

  navigateToDetails(id: string): void {
    this.router.navigateByUrl(`/products/${id}`);
  }
  filterByPrice(): void {
    if (!this.maxPrice || this.maxPrice <= 0) {
      this.loadProductsRequest(this.productService.getAllProducts());
    } else {
      this.loadProductsRequest(this.productService.getProductsByPrice(this.maxPrice));
    }
  }
}

