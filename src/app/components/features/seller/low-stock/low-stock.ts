import { Component, inject } from '@angular/core';
import { SellerService } from '../../../../services/seller';

@Component({
  selector: 'app-low-stock',
  standalone: true,
  imports: [],
  templateUrl: './low-stock.html',
  styleUrl: './low-stock.css'
})
export class LowStock {
  private sellerService = inject(SellerService);

  products: any[] = [];
  loading = true;
  error = '';

  constructor() {
    this.loadLowStock();
  }

  loadLowStock() {
    this.loading = true;
    this.sellerService.getLowStockProducts().subscribe({
      next: (res: any) => {
        this.products = res.data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load low stock products';
        this.loading = false;
      }
    });
  }
}
