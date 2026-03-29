import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:1234/auth';

  // State management
  private userState = signal<any>(JSON.parse(localStorage.getItem('user') || 'null'));
  currentUser = computed(() => this.userState());
  isLoggedIn = computed(() => !!this.userState());

  signup(data: any) {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((res: any) => this.handleAuthSuccess(res))
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