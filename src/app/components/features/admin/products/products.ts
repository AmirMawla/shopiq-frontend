import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AdminService } from '../../../../services/admin';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  private adminService = inject(AdminService);
private cdr = inject(ChangeDetectorRef);
  products: any[] = [];
  loading = true;
  error = '';

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.adminService.getAllProducts().subscribe({
      next: (res: any) => {
        this.products = res.data;
        this.loading = false;
this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'Failed to load products';
        this.loading = false;
this.cdr.detectChanges();
      }
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err: any) => alert('Failed to delete product')
      });
    }
  }
}
