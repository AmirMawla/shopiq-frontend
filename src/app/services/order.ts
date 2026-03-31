import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderByIdResponse,
  OrderDetailsResponse,
  OrdersQuery,
  PagedResult,
  SpecificVendorOrderResponse,
  UpdateShipmentStatusRequest,
  VendorRecentOrder,
} from '../models/order';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  private headers() {
    const sessionId = localStorage.getItem('x-session-id');
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (sessionId) headers['X-Session-Id'] = sessionId;
    if (token) headers['authorization'] = `Bearer ${token}`;
    return headers;
  }


  getUserOrders(query: OrdersQuery = {}): Observable<ApiResponse<PagedResult<any>>> {
    return this.httpClient.get<ApiResponse<PagedResult<any>>>(`${this.apiUrl}/users`, {
      params: query as any,
      headers: this.headers() as any,
    });
  }


  getAllOrders(query: OrdersQuery = {}): Observable<ApiResponse<PagedResult<any>>> {
    return this.httpClient.get<ApiResponse<PagedResult<any>>>(`${this.apiUrl}/all-orders`, {
      params: query as any,
      headers: this.headers() as any,
    });
  }


  getVendorOrders(query: OrdersQuery = {}): Observable<ApiResponse<PagedResult<any>>> {
    return this.httpClient.get<ApiResponse<PagedResult<any>>>(`${this.apiUrl}/vendors`, {
      params: query as any,
      headers: this.headers() as any,
    });
  }


  getTopFiveRecentVendorOrders(count = 5): Observable<ApiResponse<VendorRecentOrder[]>> {
    return this.httpClient.get<ApiResponse<VendorRecentOrder[]>>(
      `${this.apiUrl}/vendors/top-five-recent-orders`,
      {
        params: { count } as any,
        headers: this.headers() as any,
      }
    );
  }


  createOrder(body: CreateOrderRequest = {}): Observable<ApiResponse<CreateOrderResponse>> {
    return this.httpClient.post<ApiResponse<CreateOrderResponse>>(`${this.apiUrl}/`, body, {
      headers: this.headers() as any,
    });
  }


  createCashOrder(): Observable<ApiResponse<OrderByIdResponse>> {
    return this.httpClient.post<ApiResponse<OrderByIdResponse>>(`${this.apiUrl}/cash-payment`, {}, {
      headers: this.headers() as any,
    });
  }


  checkout(body: { userId?: string } = {}): Observable<ApiResponse<OrderByIdResponse>> {
    return this.httpClient.post<ApiResponse<OrderByIdResponse>>(`${this.apiUrl}/checkout`, body, {
      headers: this.headers() as any,
    });
  }


  cancelOrder(orderId: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/${orderId}/cancel`, {}, { headers: this.headers() as any });
  }


  updateOrderStatus(orderId: string, body: UpdateShipmentStatusRequest): Observable<ApiResponse<OrderByIdResponse>> {
    return this.httpClient.put<ApiResponse<OrderByIdResponse>>(`${this.apiUrl}/${orderId}/status`, body, {
      headers: this.headers() as any,
    });
  }


  webhookKashier(payload: any, signature?: string): Observable<any> {
    const headers = { ...(this.headers() as any) };
    if (signature) headers['x-kashier-signature'] = signature;
    return this.httpClient.post(`${this.apiUrl}/webhook/kashier`, payload, { headers });
  }


  getOrderById(id: string): Observable<ApiResponse<OrderByIdResponse>> {
    return this.httpClient.get<ApiResponse<OrderByIdResponse>>(`${this.apiUrl}/${id}`, {
      headers: this.headers() as any,
    });
  }


  getOrderDetails(id: string): Observable<ApiResponse<OrderDetailsResponse>> {
    return this.httpClient.get<ApiResponse<OrderDetailsResponse>>(`${this.apiUrl}/details/${id}`, {
      headers: this.headers() as any,
    });
  }


  getSpecificOrder(orderId: string, vendorId: string): Observable<ApiResponse<SpecificVendorOrderResponse>> {
    return this.httpClient.get<ApiResponse<SpecificVendorOrderResponse>>(
      `${this.apiUrl}/orders/${orderId}/vendors/${vendorId}`,
      { headers: this.headers() as any }
    );
  }


  getVendorOrder(orderId: string): Observable<ApiResponse<any>> {
    return this.httpClient.get<ApiResponse<any>>(`${this.apiUrl}/vendor/${orderId}`, {
      headers: this.headers() as any,
    });
  }
}

