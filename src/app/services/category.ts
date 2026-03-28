import { inject, Injectable} from '@angular/core';
import{Category} from '../models/category'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesS {
 private httpClient=inject(HttpClient)
  private apiUrl=`${environment.apiUrl}/categories`

  getAllCategories():Observable<Category[]>{
    return this.httpClient.get<Category[]>(this.apiUrl)
  }
  //  getCategoryById(id: string): Observable<Category> {
  //   return this.httpClient.get<Category>(`${this.apiUrl}/${id}`);
  // }
}