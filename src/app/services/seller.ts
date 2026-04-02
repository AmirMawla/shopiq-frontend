import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class SellerService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/seller`;

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  //  Profile
  getProfile() {
    return this.http.get(`${this.baseUrl}/profile`, { headers: this.getHeaders() });
  }

  updateProfile(data: any) {
    return this.http.patch(`${this.baseUrl}/profile`, data, { headers: this.getHeaders() });
  }

  closeStore() {
    return this.http.patch(`${this.baseUrl}/close-store`, {}, { headers: this.getHeaders() });
  }

  //Products
  getMyProducts() {
    return this.http.get(`${this.baseUrl}/products`, { headers: this.getHeaders() });
  }

  getMyProductById(id: string) {
    return this.http.get(`${this.baseUrl}/products/${id}`, { headers: this.getHeaders() });
  }
uploadProductImage(file: File) {
    const formData = new FormData();
    formData.append('productImage', file);
    return this.http.post(`${this.baseUrl}/products/upload-image`, formData, {
        headers: new HttpHeaders({
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        })
    });
}
  createProduct(data: any) {
    return this.http.post(`${this.baseUrl}/products`, data, { headers: this.getHeaders() });
  }

  updateProduct(id: string, data: any) {
    return this.http.patch(`${this.baseUrl}/products/${id}`, data, { headers: this.getHeaders() });
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.baseUrl}/products/${id}`, { headers: this.getHeaders() });
  }

  getLowStockProducts() {
    return this.http.get(`${this.baseUrl}/products/low-stock`, { headers: this.getHeaders() });
  }
getVendorOrders() {
    return this.http.get(`${environment.apiUrl}/orders/vendors`, { headers: this.getHeaders() });
}

updateOrderStatus(orderId: string, data: any) {
    return this.http.put(`${environment.apiUrl}/orders/${orderId}/status`, data, { headers: this.getHeaders() });
}
}
