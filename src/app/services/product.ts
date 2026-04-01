import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, Review } from '../models/product';
import { environment } from '../../environments/environment';

export interface ProductResponse {
  success: boolean;
  data: Product[];
}

export interface SingleProductResponse {
  success: boolean;
  data: Product;
}

export interface ReviewResponse {
  success: boolean;
  count?: number;
  data: Review[];
}

export interface SingleReviewResponse {
  success: boolean;
  message?: string;
  data: Review;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;
  private reviewsUrl = `${environment.apiUrl}/reviews`;
  private favoriteUrl = `${environment.apiUrl}/favourites`;

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  getAllProducts(): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(this.apiUrl);
  }

  getProductById(id: string): Observable<SingleProductResponse> {
    return this.httpClient.get<SingleProductResponse>(`${this.apiUrl}/${id}`);
  }

  getProductsByCatId(catId: string): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(`${this.apiUrl}?categoryId=${catId}`);
  }

  searchProducts(name: string): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(`${this.apiUrl}?search=${name}`);
  }

  addNewProduct(product: Product): Observable<SingleProductResponse> {
    return this.httpClient.post<SingleProductResponse>(this.apiUrl, product);
  }

  updateProduct(product: Product): Observable<SingleProductResponse> {
    return this.httpClient.put<SingleProductResponse>(`${this.apiUrl}/${product._id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }

  getProductsByPrice(maxPrice: number): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(`${this.apiUrl}?maxPrice=${maxPrice}`);
  }

  getProductReviews(productId: string): Observable<ReviewResponse> {
    return this.httpClient.get<ReviewResponse>(`${this.reviewsUrl}/${productId}`);
  }

  addReview(reviewData: {
    productId: string;
    rating: number;
    comment: string;
  }): Observable<SingleReviewResponse> {
    return this.httpClient.post<SingleReviewResponse>(this.reviewsUrl, reviewData, {
      headers: this.getHeaders(),
    });
  }

  toggleFavorite(productId: string): Observable<any> {
    return this.httpClient.post(
      `${this.favoriteUrl}/toggle`,
      { productId },
      {
        headers: this.getHeaders(),
      },
    );
  }

  getMyFavorites(): Observable<any> {
    return this.httpClient.get(this.favoriteUrl, {
      headers: this.getHeaders(),
    });
  }
}
