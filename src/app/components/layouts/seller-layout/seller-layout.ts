import { Component, DoCheck, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent, NavSection } from '../../shared/sidebar/sidebar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SidebarComponent, CommonModule],
  templateUrl: './seller-layout.html',
  styleUrl: './seller-layout.css',
})
export class SellerLayoutComponent implements DoCheck {
  authService = inject(AuthService);
  userMenuOpen = signal(false);

  sellerSections: NavSection[] = [
    {
      title: 'Seller',
      items: [
        { label: 'Dashboard', route: '/seller/dashboard' },
        { label: 'My Products', route: '/seller/products' },
        { label: 'My Orders', route: '/seller/orders' },
        { label: 'Earnings', route: '/seller/earnings' },
        { label: 'My Profile', route: '/seller/profile' },
      ],
    },
  ];

  avatarImageFailed = false;
  private lastProfilePictureUrl: string | null | undefined = undefined;

  ngDoCheck(): void {
    const url = this.authService.currentUser()?.profilePicture?.url ?? null;
    if (url !== this.lastProfilePictureUrl) {
      this.lastProfilePictureUrl = url;
      this.avatarImageFailed = false;
    }
  }

  sellerDisplayName(): string {
    const u = this.authService.currentUser();
    if (!u) return '';
    return u.sellerProfile?.storeName || u.name || 'Seller';
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update((v) => !v);
  }

  closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  onAvatarError(): void {
    this.avatarImageFailed = true;
  }

  handleLogout(): void {
    this.authService.logout();
    this.closeUserMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent): void {
    if (!this.userMenuOpen()) return;
    const t = ev.target as HTMLElement;
    if (t.closest('.seller-user-wrap')) return;
    this.userMenuOpen.set(false);
  }
}
