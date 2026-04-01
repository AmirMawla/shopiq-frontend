import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SellerService } from '../../../../services/seller';

@Component({
  selector: 'app-seller-products',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  private sellerService = inject(SellerService);

  products: any[] = [];
  loading = true;
  error = '';
  showForm = false;
  editingProduct: any = null;

  newProduct = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: ''
  };

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.sellerService.getMyProducts().subscribe({
      next: (res: any) => {
        this.products = res.data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  createProduct() {
    if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.categoryId) return;
    this.sellerService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.newProduct = { name: '', description: '', price: 0, stock: 0, categoryId: '' };
        this.showForm = false;
        this.loadProducts();
      },
      error: (err: any) => alert('Failed to create product')
    });
  }

  startEdit(product: any) {
    this.editingProduct = { ...product };
  }

  updateProduct() {
    this.sellerService.updateProduct(this.editingProduct._id, this.editingProduct).subscribe({
      next: () => {
        this.editingProduct = null;
        this.loadProducts();
      },
      error: (err: any) => alert('Failed to update product')
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.sellerService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err: any) => alert('Failed to delete product')
      });
    }
  }
}
