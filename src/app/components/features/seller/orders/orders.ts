import { Component, inject,ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SellerService } from '../../../../services/seller';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [FormsModule,DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders {
  private sellerService = inject(SellerService);
private cdr = inject(ChangeDetectorRef);
  orders: any[] = [];
  loading = true;
  error = '';

  statusOptions = [
    'preparing',
    'outfordelivery',
    'delivered',
    'returned',
    'canceled'
  ];

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.sellerService.getVendorOrders().subscribe({
      next: (res: any) => {
        console.log('Vendor orders:', res);
        this.orders = res.data?.items || res.data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'Failed to load orders';
        this.loading = false;
        this.cdr.detectChanges();

      }
    });
  }

  updateStatus(orderId: string, status: string) {
    this.sellerService.updateOrderStatus(orderId, { newStatus: status }).subscribe({
      next: () => this.loadOrders(),
      //error: (err: any) => alert('Failed to update order status')
      error: (err: any) => {
      console.log('FULL ERROR:', err);
      console.log('BACKEND MESSAGE:', err.error);

      alert(err?.error?.message || JSON.stringify(err.error));
    }
    });
  }
}
