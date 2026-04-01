import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../../../services/users';
import { ChangePasswordComponent } from '../change-password/change-password';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, ChangePasswordComponent, RouterModule],
  templateUrl: './user-details.html',
  styleUrls: ['./user-details.css'],
})
export class UserDetailsComponent implements OnInit {
  public authService = inject(AuthService);
  private userService = inject(UserService);

  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  activeTab = signal<'profile' | 'security'>('profile');

  user = this.authService.currentUser;

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile(): void {
    this.isLoading.set(true);
    this.userService.getMe().subscribe({
      next: () => this.isLoading.set(false),
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to load profile details');
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
