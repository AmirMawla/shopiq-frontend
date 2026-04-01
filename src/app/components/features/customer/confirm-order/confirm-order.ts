import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../../services/order';
import type {
  CheckoutPreviewItem,
  CheckoutPreviewResponse,
  CreateOrderRequest,
} from '../../../../models/order';

@Component({
  selector: 'app-confirm-order',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirm-order.html',
  styleUrl: './confirm-order.css',
})
export class ConfirmOrder {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  public loading = true;
  public confirmLoading = false;
  public errorMessage: string | null = null;
  public emptyCart = false;

  public preview: CheckoutPreviewResponse | null = null;
  public groupedVendors: Array<{
    vendorKey: string;
    vendorId: string | null;
    vendorName: string;
    items: CheckoutPreviewItem[];
    vendorSubtotal: number;
  }> = [];

  ngOnInit(): void {
    this.orderService.getCheckoutPreview().subscribe({
      next: (res) => {
        const data = res?.data;
        const items = data?.items ?? [];
        if (!data || !items.length) {
          this.emptyCart = true;
          this.preview = null;
          this.groupedVendors = [];
          this.errorMessage = null;
        } else {
          this.emptyCart = false;
          this.preview = data;
          this.groupedVendors = this.groupByVendor(items);
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        if (this.isEmptyCartError(err)) {
          this.emptyCart = true;
          this.preview = null;
          this.groupedVendors = [];
          this.errorMessage = null;
        } else {
          this.emptyCart = false;
          this.errorMessage = 'Failed to load checkout preview.';
        }
        this.cdr.detectChanges();
      },
    });
  }

  private isEmptyCartError(err: unknown): boolean {
    const e = err as { status?: number; error?: { message?: string; error?: string } };
    const status = e?.status;
    const msg = String(e?.error?.message || e?.error?.error || '').toLowerCase();
    if (status === 404) return true;
    return /cart.*empty|empty.*cart|cart not found|not found or empty/.test(msg);
  }

  private groupByVendor(items: CheckoutPreviewItem[]) {
    const map = new Map<
      string,
      { vendorId: string | null; vendorName: string; items: CheckoutPreviewItem[]; vendorSubtotal: number }
    >();

    for (const item of items) {
      const vendorId = item.vendorId ?? null;
      const vendorKey = vendorId ?? 'unknown';
      const existing = map.get(vendorKey);
      if (!existing) {
        map.set(vendorKey, {
          vendorId,
          vendorName: item.vendorName || 'Unknown Vendor',
          items: [item],
          vendorSubtotal: item.lineTotal,
        });
      } else {
        existing.items.push(item);
        existing.vendorSubtotal += item.lineTotal;
      }
    }

    return Array.from(map.entries()).map(([vendorKey, g]) => ({
      vendorKey,
      vendorId: g.vendorId,
      vendorName: g.vendorName,
      items: g.items,
      vendorSubtotal: g.vendorSubtotal,
    }));
  }

  public onBack() {
   
  }

  public onConfirm() {
    if (this.confirmLoading) return;
    this.confirmLoading = true;
    this.cdr.detectChanges();

    const payload: CreateOrderRequest = {};
    this.orderService.createOrder(payload).subscribe({
      next: (res) => {
        const sessionUrl = (res as any)?.data?.paymentSession?.sessionUrl;
        this.confirmLoading = false;
        this.cdr.detectChanges();
        if (sessionUrl) {
          window.location.href = sessionUrl;
        }
      },
      error: () => {
        this.confirmLoading = false;
        this.errorMessage = 'Confirm order failed. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }
}
