import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CartModel,RecieptModel } from '../models/cart';

export interface APIResponse<T> {
  success: boolean;
  message: string;
  cart?: T;
}

@Injectable({
  providedIn: 'root',
})

export class CartService {

  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor() { }

  private headers() {
    //const sessionId = localStorage.getItem('x-session-id');
    const token = localStorage.getItem('token');
    let headers: any = { //'X-Session-Id': sessionId 
     };
    if (token) {
      headers['authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  getCart(): Observable<APIResponse<CartModel>> {
    console.log(localStorage.getItem('x-session-id'));
    console.log(localStorage.getItem('token'));
    return this.httpClient.get<APIResponse<CartModel>>(`${this.apiUrl}/`, { 'headers': this.headers() })
  }

  addItem(productId: string, quantity: number): Observable<APIResponse<CartModel>> {
    return this.httpClient.post<APIResponse<CartModel>>(`${this.apiUrl}/add-item`, { productId, quantity },{ 'headers': this.headers() })
  }

  updateQuantity(productId: string, quantity: number): Observable<APIResponse<CartModel>> {
    return this.httpClient.patch<APIResponse<CartModel>>(`${this.apiUrl}/update-quantity`, { productId, quantity },{ 'headers': this.headers() })
  }

  removeItem(productId: string): Observable<APIResponse<CartModel>> {
    return this.httpClient.delete<APIResponse<CartModel>>(`${this.apiUrl}/remove-item`, { body: { productId }, 'headers': this.headers() })
  }

  isItemInCart(productId: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/is-item-in-cart/${productId}`, { 'headers': this.headers() })
  }

  getRecipet(): Observable<RecieptModel> {
    return this.httpClient.get<RecieptModel>(`${this.apiUrl}/reciept`, { 'headers': this.headers() })
  }

  checkout(): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/checkout`, {}, { 'headers': this.headers() })
  }

  applyPromoCode(promoCode: string): Observable<APIResponse<CartModel>> {
    return this.httpClient.post<APIResponse<CartModel>>(`${this.apiUrl}/promocode`, { promoCode },{ 'headers': this.headers() })
  }
}