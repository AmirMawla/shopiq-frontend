import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private usersUrl = `${environment.apiUrl}/users`;

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  getMe() {
    return this.http.get<any>(`${this.usersUrl}/me`, { headers: this.getHeaders() }).pipe(
      tap((res: any) => {
        if (res.success && res.data) {
          this.authService.updateUserState(res.data);
        }
      }),
    );
  }

  updateMe(data: any) {
    return this.http
      .patch<any>(`${this.usersUrl}/updateMe`, data, { headers: this.getHeaders() })
      .pipe(
        tap((res: any) => {
          if (res.success && res.data) {
            this.authService.updateUserState(res.data);
          }
        }),
      );
  }

  applyForSeller(data: { storeName: string; bio: string }) {
    return this.http
      .post<any>(`${this.usersUrl}/apply-seller`, data, { headers: this.getHeaders() })
      .pipe(
        tap((res: any) => {
          if (res.success && res.data) {
            this.authService.updateUserState(res.data);
          }
        }),
      );
  }
}
