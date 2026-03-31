import { Component, inject } from '@angular/core';
import { AdminService } from '../../../../services/admin';
import { DatePipe } from '@angular/common';
import { OrderService } from '../../../../services/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders {
  private adminService = inject(AdminService);
  private orderService = inject(OrderService);

  orders: any[] = [];
  loading = true;
  error = '';

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
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
