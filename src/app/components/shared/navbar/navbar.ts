import { Component, HostListener, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, merge, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart';
import { CartItemModel, CartModel } from '../../../models/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  private destroy$ = new Subject<void>();

  menuOpen = signal(false);
  scrolled = signal(false);
  userMenuOpen = signal(false);

  /** Total quantity of items in cart (sum of line quantities). */
  cartCount = 0;

  ngOnInit(): void {
    this.refreshCartCount();
    merge(
      this.cartService.cartChanged$,
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refreshCartCount());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private refreshCartCount(): void {
    this.cartService.getCart().subscribe({
      next: (res) => {
        const cart = res.cart as CartModel | undefined;
        const n = cart?.itemCount;
        if (typeof n === 'number' && Number.isFinite(n)) {
          this.cartCount = n;
          return;
        }
        this.cartCount = this.sumQuantities(cart?.items);
      },
      error: () => {
        this.cartCount = 0;
      },
    });
  }

  private sumQuantities(items: CartItemModel[] | undefined): number {
    if (!items?.length) return 0;
    return items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
  }

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
