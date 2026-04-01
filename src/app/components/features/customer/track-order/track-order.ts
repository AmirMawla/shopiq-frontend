import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService, ApiResponse } from '../../../../services/order';
import type { SpecificVendorOrderResponse, ShippingStatus } from '../../../../models/order';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './track-order.html',
  styleUrl: './track-order.css',
})
export class TrackOrder implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  errorMessage: string | null = null;

  orderId: string | null = null;
  vendorId: string | null = null;

  data: SpecificVendorOrderResponse | null = null;

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId');
    this.vendorId = this.route.snapshot.paramMap.get('vendorId');

    if (!this.orderId || !this.vendorId) {
      this.errorMessage = 'Missing order or vendor id.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.orderService.getSpecificOrder(this.orderId, this.vendorId).subscribe({
      next: (res: ApiResponse<SpecificVendorOrderResponse>) => {
        this.data = res.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load tracking details. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get shippingStatus(): ShippingStatus {
    const raw = (this.data?.shippingStatus || 'preparing') as ShippingStatus;
    const allowed: ShippingStatus[] = ['preparing', 'outfordelivery', 'delivered', 'canceled', 'returned'];
    return allowed.includes(raw) ? raw : 'preparing';
  }

  private currentStepIndex(): number {
    const status = this.shippingStatus;
    if (status === 'canceled' || status === 'returned') return -1;
    if (status === 'delivered') return 4;
    if (status === 'outfordelivery') return 3;
    return 1;
  }

  lineDone(afterStepIndex: 0 | 1 | 2 | 3): boolean {
    const currentIdx = this.currentStepIndex();
    if (currentIdx < 0) return false;
    return currentIdx > afterStepIndex;
  }

  get supportPhone(): string | null {
    const raw = this.data?.vendorPhone || null;
    if (!raw) return null;
    return String(raw).trim();
  }

  get supportTelHref(): string | null {
    const phone = this.supportPhone;
    if (!phone) return null;
    const normalized = phone.replace(/[^\d+]/g, '');
    return normalized ? `tel:${normalized}` : null;
  }

  stepState(key: 'pending' | 'processing' | 'shipped' | 'outfordelivery' | 'delivered') {
    const status = this.shippingStatus; 
    const activeOrder = ['pending', 'processing', 'shipped', 'outfordelivery', 'delivered'] as const;
    const idx = activeOrder.indexOf(key);


    const currentIdx = this.currentStepIndex();

    if (currentIdx < 0) return 'inactive'; 
    if (idx < currentIdx) return 'done';
    if (idx === currentIdx) return 'active';
    return 'todo';
  }
}
