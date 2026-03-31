import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';

export interface ProductResponse {
  success: boolean;
  data: Product[];
}

export interface SingleProductResponse {
  success: boolean;
  data: Product;
}
@Injectable({
  providedIn: 'root',
})
export class ProductService { 
  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`; 

  getAllProducts(): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(this.apiUrl)
  }

  getProductById(id: string): Observable<SingleProductResponse> {
    return this.httpClient.get<SingleProductResponse>(`${this.apiUrl}/${id}`)
  }

  getProductsByCatId(catId: string): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(`${this.apiUrl}?categoryId=${catId}`)
  }

  searchProducts(name: string): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(`${this.apiUrl}?search=${name}`)
  }

  addNewProduct(product: Product): Observable<SingleProductResponse> {
    return this.httpClient.post<SingleProductResponse>(this.apiUrl, product)
  }

  updateProduct(product: Product): Observable<SingleProductResponse> {
    return this.httpClient.put<SingleProductResponse>(`${this.apiUrl}/${product._id}`, product)
  }

  deleteProduct(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
  getProductsByPrice(maxPrice: number): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(`${this.apiUrl}?maxPrice=${maxPrice}`)
  }
}

