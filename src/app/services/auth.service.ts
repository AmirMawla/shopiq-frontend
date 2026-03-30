import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import {environment} from '../../environments/environment.development'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = `${environment.apiUrl}/auth`;
  private usersUrl = `${environment.apiUrl}/users`;

  // State management
  private userState = signal<any>(JSON.parse(localStorage.getItem('user') || 'null'));
  currentUser = computed(() => this.userState());
  isLoggedIn = computed(() => !!this.userState());

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  signup(data: any) {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  login(data: any) {
    return this.http
      .post(`${this.baseUrl}/login`, data)
      .pipe(tap((res: any) => this.handleAuthSuccess(res)));
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  verifyOtp(email: string, otp: string) {
    return this.http.post(`${this.baseUrl}/verify-otp`, { email, otp });
  }

  resetPassword(data: any) {
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }

  changePassword(data: any) {
    return this.http.patch(`${this.baseUrl}/change-password`, data, { headers: this.getHeaders() });
  }

  getMe() {
    return this.http.get<any>(`${this.usersUrl}/me`, { headers: this.getHeaders() }).pipe(
      tap((res: any) => {
        if (res.success && res.data) {
          this.userState.set(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      }),
    );
  }

  googleLogin() {
    window.location.href = `${this.baseUrl}/google`;
  }

  handleAuthSuccess(res: { token: string; user: any }) {
    if (res.token && res.user) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      this.userState.set(res.user);
    }
  }

  logout() {
    localStorage.clear();
    this.userState.set(null);
    this.router.navigate(['/auth/login']);
  }
}
