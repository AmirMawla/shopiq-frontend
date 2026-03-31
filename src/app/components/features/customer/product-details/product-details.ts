import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import{Product} from '../../../../models/product';
import { Category } from '../../../../models/category';
import { ProductService } from '../../../../services/product';
import { CategoriesS} from '../../../../services/category';
import { Router } from '@angular/router';
import { CartService } from '../../../../services/cart';
@Component({
  selector: 'app-product-details',
  imports: [RouterLink, AsyncPipe, JsonPipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
 private activatedRoute = inject(ActivatedRoute);
  private apiProductsSErvice = inject(ProductService)
  private cdr = inject(ChangeDetectorRef)
  private router = inject(Router);
  private cartService = inject(CartService);
  isInCart = false;
  product$!: Observable<Product>
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.product$ = this.apiProductsSErvice.getProductById(id)
    
    this.cartService.isItemInCart(id).subscribe({
    next: (res) => {
      this.isInCart = res?.inCart || false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.isInCart = false;
      this.cdr.detectChanges();
    }
  });

  }
  addToCart(productId: string) {
  this.cartService.addItem(productId, 1).subscribe({
    next: () => {
      this.isInCart = true;
      alert('Product added to cart 🛒');
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
      this.cdr.detectChanges();
    }
  });
  }

  goBack() {
    this.router.navigate(['/products']);
    this.cdr.detectChanges();
  }
}
