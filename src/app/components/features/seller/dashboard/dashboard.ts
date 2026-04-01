import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  VendorAnalyticsService,
  type VendorMainStats,
  type RevenueMonthlyRow,
  type PaymentMethodRow,
  type OrdersDailyRow,
  type OrdersByStatusRow,
  type TopCategoryRow,
  type TopProductRow,
  type RecentVendorOrderRow,
} from '../../../../services/vendor-analytics';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private analytics = inject(VendorAnalyticsService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  error: string | null = null;

  stats: VendorMainStats | null = null;
  revenueMonthly: RevenueMonthlyRow[] = [];
  paymentMethods: PaymentMethodRow[] = [];
  ordersDaily: OrdersDailyRow[] = [];
  ordersByStatus: OrdersByStatusRow[] = [];
  topProducts: TopProductRow[] = [];
  topCategories: TopCategoryRow[] = [];
  recentOrders: RecentVendorOrderRow[] = [];

  ngOnInit(): void {
    this.loadAll();
  }

  refresh(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    let done = 0;
    const total = 7;
    const markDone = () => {
      done += 1;
      if (done >= total) this.loading = false;
      this.cdr.detectChanges();
    };

    this.analytics.getStats().subscribe({
      next: (res) => {
        this.stats = res;
        markDone();
      },
      error: (err) => {
        this.error = this.pickError(err) || 'Failed to load seller dashboard.';
        markDone();
      },
    });

    this.analytics.getRevenueMonthly(6).subscribe({
      next: (res) => {
        this.revenueMonthly = res.data || [];
        markDone();
      },
      error: () => markDone(),
    });

    this.analytics.getPaymentMethods().subscribe({
      next: (res) => {
        this.paymentMethods = res.data || [];
        markDone();
      },
      error: () => markDone(),
    });

    this.analytics.getOrdersDaily(14).subscribe({
      next: (res) => {
        this.ordersDaily = res.data || [];
        markDone();
      },
      error: () => markDone(),
    });

    this.analytics.getOrdersByStatus().subscribe({
      next: (res) => {
        this.ordersByStatus = res.data || [];
        markDone();
      },
      error: () => markDone(),
    });

    this.analytics.getTopProducts(5).subscribe({
      next: (res) => {
        this.topProducts = res.data || [];
        markDone();
      },
      error: () => markDone(),
    });

    this.analytics.getTopCategories(5).subscribe({
      next: (res) => {
        this.topCategories = res.data || [];
        markDone();
      },
      error: () => markDone(),
    });

    this.analytics.getRecentOrders(6).subscribe({
      next: (res) => {
        this.recentOrders = res.data || [];
        markDone();
      },
      error: () => markDone(),
    });
  }

  fmtMoney(n: number | null | undefined): string {
    const v = Number(n ?? 0);
    return `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }

  fmtMoney2(n: number | null | undefined): string {
    const v = Number(n ?? 0);
    return `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  fmtPct(n: number | null | undefined): string {
    const v = Number(n ?? 0);
    const sign = v > 0 ? '+' : '';
    return `${sign}${v.toFixed(1)}%`;
  }

  trendClass(n: number | null | undefined): string {
    const v = Number(n ?? 0);
    if (v > 0) return 'trend up';
    if (v < 0) return 'trend down';
    return 'trend flat';
  }

  pillClass(status: string | null | undefined): string {
    const s = String(status || '').toLowerCase();
    if (s === 'delivered') return 'pill pill-delivered';
    if (s === 'shipped') return 'pill pill-shipped';
    if (s === 'processing' || s === 'proccessing') return 'pill pill-processing';
    if (s === 'pending' || s === 'notpayed') return 'pill pill-pending';
    if (s === 'cancelled' || s === 'canceled') return 'pill pill-cancelled';
    return 'pill pill-pending';
  }

  barHeights(): number[] {
    const vals = (this.revenueMonthly || []).map((x) => Number(x.revenue || 0));
    const max = Math.max(1, ...vals);
    return vals.map((v) => Math.round((v / max) * 100));
  }

  linePoints(): string {
    const vals = (this.ordersDaily || []).map((x) => Number(x.orders || 0));
    const max = Math.max(1, ...vals);
    const min = Math.min(...vals, 0);
    const w = 520;
    const h = 170;
    const padX = 14;
    const padY = 12;
    const n = vals.length || 1;
    const xStep = (w - padX * 2) / Math.max(1, n - 1);
    const yFor = (v: number) => {
      const t = (v - min) / Math.max(1, max - min);
      return (h - padY) - t * (h - padY * 2);
    };
    return vals.map((v, i) => `${padX + i * xStep},${yFor(v).toFixed(2)}`).join(' ');
  }

  donutSegments(rows: { percentage: number }[], radius = 44): { dash: string; offset: number }[] {
    const circ = 2 * Math.PI * radius;
    let offset = 0;
    return rows.map((r) => {
      const pct = Math.max(0, Math.min(100, Number(r.percentage || 0)));
      const len = (pct / 100) * circ;
      const seg = { dash: `${len} ${circ - len}`, offset };
      offset -= len;
      return seg;
    });
  }

  ordersByStatusToPct(): Array<{ status: string; count: number; percentage: number }> {
    const rows = this.ordersByStatus || [];
    const total = rows.reduce((s, r) => s + Number(r.count || 0), 0) || 0;
    return rows.map((r) => ({
      status: r.status,
      count: r.count,
      percentage: total > 0 ? Math.round((Number(r.count || 0) / total) * 1000) / 10 : 0,
    }));
  }

  topCategoryPct(revenue: number): number {
    const rows = this.topCategories || [];
    const max = Math.max(1, ...rows.map((r) => Number(r.totalRevenue || 0)));
    const v = Math.max(0, Number(revenue || 0));
    return Math.round((v / max) * 100);
  }

  private pickError(err: any): string | null {
    return err?.error?.message || err?.error?.Message || err?.error?.error || err?.message || null;
  }
}
