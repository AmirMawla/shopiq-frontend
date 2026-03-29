// src/app/services/auth.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:1234/auth';

  // 1. Initialize Signal from LocalStorage so state persists on refresh
  currentUser = signal<any>(JSON.parse(localStorage.getItem('user') || 'null'));
  
  // 2. Computed value for easy template checks
  isLoggedIn = computed(() => !!this.currentUser());

  signup(data: any) {
    return this.http.post(`${this.baseUrl}/signup`, data).pipe(
      tap((res: any) => this.handleAuthSuccess(res))
    );
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((res: any) => this.handleAuthSuccess(res))
    );
  }

  googleLogin() {
    window.location.href = `${this.baseUrl}/google`;
  }

  // 3. Centralized method to save data and update UI state
  handleAuthSuccess(res: { token: string; user: any }) {
    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      
      // Update Signal: This immediately updates the Navbar!
      this.currentUser.set(res.user);
    }
  }

  // 4. Logout Logic
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null); // Reset Signal
    this.router.navigate(['/auth/login']);
  }
}