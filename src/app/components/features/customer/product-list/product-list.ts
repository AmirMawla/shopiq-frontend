import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import{Product} from '../../../../models/product';
import { Category } from '../../../../models/category';
import { ProductService } from '../../../../services/product';
import { CategoriesS} from '../../../../services/category';
import { Observable } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [AsyncPipe, NgClass, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoriesS);
  private router = inject(Router);

  products$!: Observable<Product[]>;
  categories$!: Observable<Category[]>;

  selectedCategoryId: string = '';
  searchQuery: string = '';
  maxPrice: number = 0

  ngOnInit(): void {
    this.products$ = this.productService.getAllProducts();
    this.categories$ = this.categoryService.getAllCategories();
  }

  filterByCategory(catId: string): void {
    if (!catId) {
      this.products$ = this.productService.getAllProducts();
    } else {
      this.products$ = this.productService.getProductsByCatId(catId);
    }
  }

  searchProducts(): void {
    if (!this.searchQuery) {
      this.products$ = this.productService.getAllProducts();
    } else {
      this.products$ = this.productService.searchProducts(this.searchQuery);
    }
  }

  navigateToDetails(id: string): void {
    this.router.navigateByUrl(`/products/${id}`);
  }
  filterByPrice(): void {
    if (!this.maxPrice || this.maxPrice <= 0) {
      this.products$ = this.productService.getAllProducts();
    } else {
      this.products$ = this.productService.getProductsByPrice(this.maxPrice);
    }
  }
}

