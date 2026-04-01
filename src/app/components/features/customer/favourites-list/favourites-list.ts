import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../services/product';
import { ProductCardComponent } from '../../../shared/product-card/product-card';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './favourites-list.html',
  styleUrl: "./favourites-list.css"
})
export class FavoritesList implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  favorites: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadFavorites();
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

  removeItem(productId: string, event: Event): void {
    event.stopPropagation();
    this.productService.toggleFavorite(productId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter((f) => f.productId?._id !== productId);
        this.cdr.detectChanges();
      },
    });
  }
}
