import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidebarComponent, NavSection } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SidebarComponent],
  templateUrl: './admin-layout.html',
})
export class AdminLayoutComponent {
  pageTitle = 'Dashboard';

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
}
