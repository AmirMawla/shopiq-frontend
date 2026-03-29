import { Component, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  authService = inject(AuthService);

  menuOpen = signal(false);
  scrolled = signal(false);
  userMenuOpen = signal(false);

  cartCount = 0;

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 10);
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  toggleUserMenu() {
    this.userMenuOpen.set(!this.userMenuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
    this.userMenuOpen.set(false);
  }

  handleLogout() {
    this.authService.logout();
    this.closeMenu();
  }
}
