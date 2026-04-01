// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class Banner {}
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Banner } from '../models/banner';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/banners`;

  getActiveBanners(): Observable<Banner[]> {
    return this.httpClient.get<any>(`${this.apiUrl}/active`).pipe(
      map(res => res.data)
    );
  }
}
