import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

getAllProducts(): Observable<Product[]> {
  return this.httpClient.get<any>(this.apiUrl)
    .pipe(map(res => res.data));
}

getProductsByCatId(catId: string): Observable<Product[]> {
  return this.httpClient.get<any>(`${this.apiUrl}?categoryId=${catId}`)
    .pipe(map(res => res.data));
}

searchProducts(name: string): Observable<Product[]> {
  return this.httpClient.get<any>(`${this.apiUrl}?search=${name}`)
    .pipe(map(res => res.data));
}

getProductsByPrice(maxPrice: number): Observable<Product[]> {
  return this.httpClient.get<any>(`${this.apiUrl}?maxPrice=${maxPrice}`)
    .pipe(map(res => res.data));
}

  getProductById(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.apiUrl}/${id}`);
  }


  addNewProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.apiUrl, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.httpClient.put<Product>(`${this.apiUrl}/${product._id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
}
