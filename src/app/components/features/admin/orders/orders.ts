import { Component, inject } from '@angular/core';
import { AdminService } from '../../../../services/admin';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders {
  private adminService = inject(AdminService);

  orders: any[] = [];
  loading = true;
  error = '';

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.adminService.getAllOrders().subscribe({
      next: (res: any) => {
        console.log('Orders response:', res);
        this.orders = res.data.items;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading orders:', err);
        this.error = 'Failed to load orders';
        this.loading = false;
      }
    });
  }
}
