import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import type {
  PaymentStatsResponse,
  PagedResult,
  RevenueByPaymentMethodRow,
  TransactionListQuery,
  TransactionRow,
  TransactionsCountResponse,
  UserTransactionsQuery,
  VendorTransactionRow,
  VendorTransactionsQuery,
} from '../models/payment';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  private headers() {
    const sessionId = localStorage.getItem('x-session-id');
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (sessionId) headers['X-Session-Id'] = sessionId;
    if (token) headers['authorization'] = `Bearer ${token}`;
    return headers;
  }

  // GET /payments/transactions/count
  getTransactionsCount(): Observable<ApiResponse<TransactionsCountResponse>> {
    return this.httpClient.get<ApiResponse<TransactionsCountResponse>>(`${this.apiUrl}/transactions/count`, {
      headers: this.headers() as any,
    });
  }

  // GET /payments/stats
  getPaymentStats(): Observable<ApiResponse<PaymentStatsResponse>> {
    return this.httpClient.get<ApiResponse<PaymentStatsResponse>>(`${this.apiUrl}/stats`, {
      headers: this.headers() as any,
    });
  }

  // GET /payments/revenue/by-payment-method
  getAllRevenueByPaymentMethod(): Observable<ApiResponse<RevenueByPaymentMethodRow[]>> {
    return this.httpClient.get<ApiResponse<RevenueByPaymentMethodRow[]>>(`${this.apiUrl}/revenue/by-payment-method`, {
      headers: this.headers() as any,
    });
  }

  // GET /payments/revenue/vendor/by-payment-method
  getVendorRevenueByPaymentMethod(): Observable<ApiResponse<RevenueByPaymentMethodRow[]>> {
    return this.httpClient.get<ApiResponse<RevenueByPaymentMethodRow[]>>(
      `${this.apiUrl}/revenue/vendor/by-payment-method`,
      { headers: this.headers() as any }
    );
  }

  // GET /payments/transactions
  getAllTransactions(query: TransactionListQuery = {}): Observable<ApiResponse<PagedResult<TransactionRow>>> {
    return this.httpClient.get<ApiResponse<PagedResult<TransactionRow>>>(`${this.apiUrl}/transactions`, {
      params: query as any,
      headers: this.headers() as any,
    });
  }

  // GET /payments/vendor/transactions
  getVendorTransactions(query: VendorTransactionsQuery = {}): Observable<ApiResponse<PagedResult<VendorTransactionRow>>> {
    return this.httpClient.get<ApiResponse<PagedResult<VendorTransactionRow>>>(`${this.apiUrl}/vendor/transactions`, {
      params: query as any,
      headers: this.headers() as any,
    });
  }

  // GET /payments/user/transactions
  getUserTransactions(query: UserTransactionsQuery = {}): Observable<ApiResponse<PagedResult<TransactionRow>>> {
    return this.httpClient.get<ApiResponse<PagedResult<TransactionRow>>>(`${this.apiUrl}/user/transactions`, {
      params: query as any,
      headers: this.headers() as any,
    });
  }
}

