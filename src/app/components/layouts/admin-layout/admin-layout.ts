import { Component, DoCheck, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent, NavSection } from '../../shared/sidebar/sidebar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SidebarComponent, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayoutComponent implements DoCheck {
  pageTitle = 'Dashboard';
  authService = inject(AuthService);
  userMenuOpen = signal(false);

  avatarImageFailed = false;
  private lastProfilePictureUrl: string | null | undefined = undefined;

  adminSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', route: '/admin/dashboard' },
        { label: 'Products', route: '/admin/products'},
        { label: 'Orders', route: '/admin/orders'},
        { label: 'Users', route: '/admin/users' },
        { label: 'Categories', route: '/admin/categories' },
        { label: 'Banners', route: '/admin/banners' },
      ],
    },
    {
      title: 'Commerce',
      items: [
        { label: 'Offers & Promos', route: '/admin/offers' },
        { label: 'Reviews', route: '/admin/reviews' },
        { label: 'Payments', route: '/admin/payments' },
        { label: 'Shipping', route: '/admin/shipping' },
      ],
    },
    {
      title: 'Vendor',
      items: [{ label: 'Sellers', route: '/admin/sellers' }],
    },
    {
      title: 'System',
      items: [{ label: 'Settings', route: '/admin/settings' }],
    },
  ];

  ngDoCheck(): void {
    const url = this.authService.currentUser()?.profilePicture?.url ?? null;
    if (url !== this.lastProfilePictureUrl) {
      this.lastProfilePictureUrl = url;
      this.avatarImageFailed = false;
    }
  }

  adminDisplayName(): string {
    const u = this.authService.currentUser();
    if (!u) return '';
    return u.name?.trim() || 'Admin';
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
    if (t.closest('.admin-user-wrap')) return;
    this.userMenuOpen.set(false);
  }
}
