import { inject, Injectable} from '@angular/core';
import{Category} from '../models/category'
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CategoryResponse {
  success: boolean;
  data: Category[];
}
@Injectable({
  providedIn: 'root',
})
export class CategoriesS {
 private httpClient=inject(HttpClient)
  private apiUrl=`${environment.apiUrl}/categories`

  getAllCategories():Observable<CategoryResponse>{
    return this.httpClient.get<CategoryResponse>(this.apiUrl)
  }
  getCategoryById(id: string): Observable<CategoryResponse> {
    return this.httpClient.get<CategoryResponse>(`${this.apiUrl}/${id}`);
  }
}