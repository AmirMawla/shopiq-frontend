import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, ApiResponse } from '../../../../services/order';
import type { PagedResult, VendorRecentOrder } from '../../../../models/order';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-orders.html',
  styleUrl: './user-orders.css',
})
export class UserOrders implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  errorMessage: string | null = null;

  orders: Array<{
    status: string;
    orderDate: string;
    totalAmount: number;
    itemCount: number;
    vendors: Array<{ vendorId: string | null; vendorName: string; vendorSubtotal: number; totalQuantity: number }>;
    id: string;
  }> = [];

  ngOnInit(): void {
    this.fetchOrders();
  }

  private fetchOrders(): void {
    this.loading = true;
    this.errorMessage = null;
    this.cdr.detectChanges();

    this.orderService
      .getUserOrders({ page: 1, limit: 20 })
      .subscribe({
        next: (res: ApiResponse<PagedResult<any>>) => {
          const items = res.data.items || [];
          this.orders = items.map((x: any) => ({
            id: x.id,
            status: x.status,
            orderDate: x.orderDate,
            totalAmount: x.totalAmount,
            itemCount: x.itemCount ?? 0,
            vendors: Array.isArray(x.vendors) ? x.vendors : [],
          }));
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Failed to load your orders. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  onShow(orderId: string): void {
    // Placeholder: will navigate to order details in future
    console.log('Show order', orderId);
  }
}
