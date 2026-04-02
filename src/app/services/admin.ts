import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/admin`;

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  //Users
  getAllUsers() {
    return this.http.get(`${this.baseUrl}/users`, { headers: this.getHeaders() });
  }

  getUser(id: string) {
    return this.http.get(`${this.baseUrl}/users/${id}`, { headers: this.getHeaders() });
  }

  toggleRestriction(id: string) {
    return this.http.patch(`${this.baseUrl}/users/${id}/restrict`, {}, { headers: this.getHeaders() });
  }

  //Sellers
  getPendingSellers() {
    return this.http.get(`${this.baseUrl}/seller-applications`, { headers: this.getHeaders() });
  }

  decideSellerApplication(id: string, decision: string) {
    return this.http.patch(`${this.baseUrl}/approve-seller/${id}`, { decision }, { headers: this.getHeaders() });
  }

  //Products
  getAllProducts() {
    return this.http.get(`${this.baseUrl}/products`, { headers: this.getHeaders() });
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

  // Categories
  getAllCategories() {
    return this.http.get(`${this.baseUrl}/categories`, { headers: this.getHeaders() });
  }

  createCategory(data: any) {
    return this.http.post(`${this.baseUrl}/categories`, data, { headers: this.getHeaders() });
  }

  updateCategory(id: string, data: any) {
    return this.http.patch(`${this.baseUrl}/categories/${id}`, data, { headers: this.getHeaders() });
  }

  deleteCategory(id: string) {
    return this.http.delete(`${this.baseUrl}/categories/${id}`, { headers: this.getHeaders() });
  }

  // Order
  getAllOrders() {
    return this.http.get(`${environment.apiUrl}/orders/all-orders`, { headers: this.getHeaders() });
  }

  updateOrderStatus(id: string, data: any) {
    return this.http.put(`${environment.apiUrl}/orders/${id}/status`, data, { headers: this.getHeaders() });
  }

  //Banners
  getAllBanners() {
    return this.http.get(`${this.baseUrl}/banners`, { headers: this.getHeaders() });
  }
uploadBannerImage(file: File) {
    const formData = new FormData();
    formData.append('bannerImage', file);
    return this.http.post(`${this.baseUrl}/banners/upload-image`, formData, {
        headers: new HttpHeaders({
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        })
    });
}
  createBanner(data: any) {
    return this.http.post(`${this.baseUrl}/banners`, data, { headers: this.getHeaders() });
  }

  updateBanner(id: string, data: any) {
    return this.http.patch(`${this.baseUrl}/banners/${id}`, data, { headers: this.getHeaders() });
  }

  deleteBanner(id: string) {
    return this.http.delete(`${this.baseUrl}/banners/${id}`, { headers: this.getHeaders() });
  }

  toggleBanner(id: string) {
    return this.http.patch(`${this.baseUrl}/banners/${id}/toggle`, {}, { headers: this.getHeaders() });
  }
}
