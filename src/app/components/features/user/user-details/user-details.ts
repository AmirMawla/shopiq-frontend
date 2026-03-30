import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { ChangePasswordComponent } from '../change-password/change-password';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, ChangePasswordComponent],
  templateUrl: './user-details.html',
  styleUrls: ['./user-details.css'],
})
export class UserDetailsComponent implements OnInit {
  public authService = inject(AuthService);

  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  activeTab = signal<'profile' | 'security'>('profile');

  user = this.authService.currentUser;

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile(): void {
    this.isLoading.set(true);
    this.authService.getMe().subscribe({
      next: () => this.isLoading.set(false),
      error: (err) => {
        this.errorMessage.set('Failed to load profile details');
        this.isLoading.set(false);
      },
    });
  }

  getInitials(name: string): string {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : '?';
  }
}
