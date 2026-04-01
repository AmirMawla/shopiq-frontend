import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface VendorMainStats {
  totalRevenue: number;
  revenueLastMonth: number;
  revenueGrowthPercent: number;

  totalOrders: number;
  ordersLastMonth: number;
  ordersGrowthPercent: number;

  totalProducts: number;
  newProductsThisMonth: number;
  productsGrowthPercent: number;

  lowStockProducts: number;
  ordersToday: number;

  avgOrderValue: number;
  aovGrowthPercent: number;
}

export interface RevenueMonthlyRow {
  month: string;
  year: number;
  revenue: number;
}

export interface PaymentMethodRow {
  method: string;
  label: string;
  total: number;
  percentage: number;
}

export interface OrdersByStatusRow {
  status: string;
  count: number;
}

export interface OrdersDailyRow {
  date: string;
  orders: number;
}

export interface TopProductRow {
  rank: number;
  productId: string;
  name: string;
  category: string;
  imageUrl: string | null;
  totalOrders: number;
  totalRevenue: number;
}

export interface TopCategoryRow {
  rank: number;
  categoryId: string;
  name: string;
  totalRevenue: number;
  totalOrders: number;
}

export interface RecentVendorOrderRow {
  _id: string;
  userId: { name: string; email: string } | null;
  items: { productName: string; quantity: number }[];
  vendorAmount: number;
  status: string;
  createdAt: string;
}

export interface RecentOrdersResponse {
  data: RecentVendorOrderRow[];
  pagination: { total: number; page: number; limit: number };
}

export interface DataListResponse<T> {
  data: T[];
}

@Injectable({ providedIn: 'root' })
export class VendorAnalyticsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/seller`;

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  getStats(): Observable<VendorMainStats> {
    return this.http.get<VendorMainStats>(`${this.baseUrl}/stats`, { headers: this.getHeaders() });
  }

  getRevenueMonthly(months = 6): Observable<DataListResponse<RevenueMonthlyRow>> {
    return this.http.get<DataListResponse<RevenueMonthlyRow>>(`${this.baseUrl}/stats/revenue-monthly?months=${months}`, {
      headers: this.getHeaders(),
    });
  }

  getPaymentMethods(): Observable<DataListResponse<PaymentMethodRow>> {
    return this.http.get<DataListResponse<PaymentMethodRow>>(`${this.baseUrl}/stats/payment-methods`, {
      headers: this.getHeaders(),
    });
  }

  getOrdersByStatus(): Observable<DataListResponse<OrdersByStatusRow>> {
    return this.http.get<DataListResponse<OrdersByStatusRow>>(`${this.baseUrl}/stats/orders-by-status`, {
      headers: this.getHeaders(),
    });
  }

  getOrdersDaily(days = 14): Observable<DataListResponse<OrdersDailyRow>> {
    return this.http.get<DataListResponse<OrdersDailyRow>>(`${this.baseUrl}/stats/orders-daily?days=${days}`, {
      headers: this.getHeaders(),
    });
  }

  getTopProducts(limit = 5): Observable<DataListResponse<TopProductRow>> {
    return this.http.get<DataListResponse<TopProductRow>>(`${this.baseUrl}/stats/top-products?limit=${limit}`, {
      headers: this.getHeaders(),
    });
  }

  getTopCategories(limit = 5): Observable<DataListResponse<TopCategoryRow>> {
    return this.http.get<DataListResponse<TopCategoryRow>>(`${this.baseUrl}/stats/top-categories?limit=${limit}`, {
      headers: this.getHeaders(),
    });
  }

  getRecentOrders(limit = 5): Observable<RecentOrdersResponse> {
    return this.http.get<RecentOrdersResponse>(`${this.baseUrl}/recent-orders?limit=${limit}`, { headers: this.getHeaders() });
  }
}

