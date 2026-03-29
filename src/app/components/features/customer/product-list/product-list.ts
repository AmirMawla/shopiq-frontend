import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../../models/product';
import { Category } from '../../../../models/category';
import { ProductService } from '../../../../services/product';
import { CategoriesS } from '../../../../services/category';
import { Observable, of } from 'rxjs'; 
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

  products: Product[] = []; 
  products$!: Observable<Product[]>;
  categories$!: Observable<Category[]>;

  selectedCategoryId: string = '';
  searchQuery: string = '';
  maxPrice: number = 0;

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
      },
      error: (err) => console.log(err)
    });
    this.categories$ = this.categoryService.getAllCategories();
  }

  applyFilters(): void {
    this.products$ = of(this.products.filter(p => {
      const matchName = !this.searchQuery ||
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchCat = !this.selectedCategoryId ||
        (p.categoryId as any)?._id === this.selectedCategoryId;
      
      const matchPrice = !this.maxPrice || 
        this.maxPrice <= 0 || 
        p.price <= this.maxPrice;

      return matchName && matchCat && matchPrice;
    }));
  }

  navigateToDetails(id: string): void {
    this.router.navigateByUrl(`/products/${id}`);
  }
}