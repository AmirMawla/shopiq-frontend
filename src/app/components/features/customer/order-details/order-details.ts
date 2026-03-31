import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService, ApiResponse } from '../../../../services/order';
import type { OrderDetailsResponse, OrderDetailsVendorSummary } from '../../../../models/order';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  loading = true;
  errorMessage: string | null = null;

  order: OrderDetailsResponse | null = null;
  orderId: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.orderId = id;
    if (!this.orderId) {
      this.errorMessage = 'Order id is missing.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.orderService.getOrderDetails(this.orderId).subscribe({
      next: (res: ApiResponse<OrderDetailsResponse>) => {
        this.order = res.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load order details. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onTrackVendor(vendor: OrderDetailsVendorSummary): void {
    if (!this.orderId || !vendor.vendorId) return;
    this.router.navigate(['/track-order', this.orderId, vendor.vendorId]);
  }
}
