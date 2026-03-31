import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService, ApiResponse } from '../../../../services/order';
import type { OrderDetailsResponse, OrderDetailsVendorSummary } from '../../../../models/order';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  errorMessage: string | null = null;

  order: OrderDetailsResponse | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Order id is missing.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.orderService.getOrderDetails(id).subscribe({
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
   
    console.log('Track vendor', vendor.vendorId);
  }
}
