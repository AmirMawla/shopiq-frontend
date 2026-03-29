// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:1234/auth';

  signup(data: any) {
    return this.http
      .post(`${this.baseUrl}/signup`, data)
      .pipe(tap((res: any) => this.handleAuthSuccess(res)));
  }

  login(data: any) {
    return this.http
      .post(`${this.baseUrl}/login`, data)
      .pipe(tap((res: any) => this.handleAuthSuccess(res)));
  }

  googleLogin() {
    window.location.href = `${this.baseUrl}/google`;
  }

  handleAuthSuccess(res: { token: string; user: any }) {
    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      console.log('✅ LocalStorage Updated');
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
