import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../../models/product';
import { CartService } from '../../../services/cart';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCardComponent {
  private router = inject(Router);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) product!: Product;
  /** Quantity of this product currently in cart (from parent sync). */
  @Input() quantity = 0;
  @Input() favorited = false;
  @Output() cartUpdated = new EventEmitter<void>();
  @Output() favoriteToggled = new EventEmitter<void>();

  cartBusy = false;

  readonly stars = [1, 2, 3, 4, 5] as const;

  get categoryLabel(): string {
    const c = this.product?.categoryId as any;
    if (c && typeof c === 'object' && c.name) return c.name;
    return typeof c === 'string' ? c : '—';
  }

  get rating(): number {
    const r = Number(this.product?.averageRating);
    return Number.isFinite(r) ? Math.min(5, Math.max(0, r)) : 0;
  }

  isStarFilled(starIndex: number): boolean {
    return starIndex <= Math.round(this.rating);
  }

  goDetails(event?: Event): void {
    event?.stopPropagation();
    const id = this.product._id;
    if (id) this.router.navigateByUrl(`/products/${id}`);
  }

  goCart(event: Event): void {
    event.stopPropagation();
    this.router.navigateByUrl('/cart');
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/auth/login');
      return;
    }
    const id = this.product._id;
    if (!id) return;
    this.productService.toggleFavorite(id).subscribe({
      next: () => {
        this.favoriteToggled.emit();
        this.cdr.markForCheck();
      },
    });
  }

  inc(event: Event): void {
    event.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/auth/login');
      return;
    }
    const id = this.product._id;
    if (!id || this.product.stock <= 0) return;
    const next = this.quantity + 1;
    if (next > this.product.stock) return;

    this.cartBusy = true;
    const done = () => {
      this.cartBusy = false;
      this.cdr.markForCheck();
    };

    if (this.quantity <= 0) {
      this.cartService.addItem(id, 1).subscribe({
        next: () => {
          done();
          this.cartUpdated.emit();
        },
        error: () => done(),
      });
    } else {
      this.cartService.updateQuantity(id, next).subscribe({
        next: () => {
          done();
          this.cartUpdated.emit();
        },
        error: () => done(),
      });
    }
  }

  dec(event: Event): void {
    event.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/auth/login');
      return;
    }
    const id = this.product._id;
    if (!id || this.quantity <= 0) return;

    this.cartBusy = true;
    const done = () => {
      this.cartBusy = false;
      this.cdr.markForCheck();
    };

    if (this.quantity <= 1) {
      this.cartService.removeItem(id).subscribe({
        next: () => {
          done();
          this.cartUpdated.emit();
        },
        error: () => done(),
      });
    } else {
      this.cartService.updateQuantity(id, this.quantity - 1).subscribe({
        next: () => {
          done();
          this.cartUpdated.emit();
        },
        error: () => done(),
      });
    }
  }
}
