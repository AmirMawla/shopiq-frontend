import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent, NavSection } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="dashboard-shell">
      <app-sidebar [sections]="sellerSections" />
      <div class="dashboard-main">
        <div class="dashboard-topbar">
          <span style="font-size:13px; color: var(--muted);">
            ShopIQ / <strong style="color:var(--text)">Seller Panel</strong>
          </span>
        </div>
        <div class="dashboard-content">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
})
export class SellerLayoutComponent {
  sellerSections: NavSection[] = [
    {
      title: 'Seller',
      items: [
        { label: 'Dashboard', route: '/seller/dashboard' },
        { label: 'My Products', route: '/seller/products' },
        { label: 'My Orders', route: '/seller/orders' },
        { label: 'Earnings', route: '/seller/earnings' },
      ],
    },
  ];
}
