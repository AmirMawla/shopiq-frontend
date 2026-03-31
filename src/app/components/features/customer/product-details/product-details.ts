import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/product';
import { CartService } from '../../../../services/cart';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
 private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private apiProductsSErvice = inject(ProductService)
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef)

  product: Product | null = null;
  loading = true;
  isInCart = false;
  cartError: string | null = null;
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.apiProductsSErvice.getProductById(id).subscribe({
      next: (res) => {
        this.product = res.data;
        this.loading = false;
        this.cdr.detectChanges();

        const productId = this.product?._id;
        if (productId) {
          this.cartService.isItemInCart(productId).subscribe({
            next: (r) => {
              this.isInCart = !!(r as any)?.isExist;
              this.cdr.detectChanges();
            },
            error: () => {
              this.isInCart = false;
              this.cdr.detectChanges();
            },
          });
        }
      },
      error: () => {
        this.product = null;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  goBack(): void {
    this.router.navigateByUrl('/products');
  }

  addToCart(productId: string): void {
    if (!productId || this.isInCart) return;
    this.cartError = null;
    this.cartService.addItem(productId, 1).subscribe({
      next: () => {
        this.isInCart = true;
        this.router.navigateByUrl('/cart');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Add to cart failed', err);
        const status = (err as any)?.status;
        const apiMsg =
          (err as any)?.error?.message ||
          (err as any)?.error?.Message ||
          (err as any)?.error?.error ||
          (err as any)?.message ||
          null;
        if (status === 401 || status === 403) {
          this.cartError = apiMsg || 'Please login first to add items to cart.';
          this.router.navigateByUrl('/auth/login');
        } else {
          this.cartError = apiMsg || 'Failed to add item to cart. Please try again.';
        }
        this.cdr.detectChanges();
      },
    });
  }
}


// import { Component, inject, OnInit } from '@angular/core';
// import { ActivatedRoute, RouterLink } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AsyncPipe, JsonPipe } from '@angular/common';
// import { Product } from '../../../../models/product';
// import { ProductService } from '../../../../services/product';

// @Component({
//   selector: 'app-product-details',
//   imports: [RouterLink, AsyncPipe, JsonPipe],
//   templateUrl: './product-details.html',
//   styleUrl: './product-details.css',
// })
// export class ProductDetails implements OnInit {
//   private route = inject(ActivatedRoute);
//   private apiProductsService = inject(ProductService);

//   product$!: Observable<Product>;

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     console.log(id);
//     this.product$ = this.apiProductsService.getProductById(id!);
//   }
// }