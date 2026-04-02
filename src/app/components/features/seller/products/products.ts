import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SellerService } from '../../../../services/seller';
import { CategoriesS } from '../../../../services/category';
import { Category } from '../../../../models/category';

@Component({
  selector: 'app-seller-products',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  private sellerService = inject(SellerService);
  private categoriesService = inject(CategoriesS);

  products: any[] = [];
  loading = true;
  error = '';
  showForm = false;
  editingProduct: any = null;
  selectedFile: File | null = null;
  uploading = false;

  categories: Category[] = [];
  categoriesLoading = false;
  categoriesError = '';

  newProduct = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
    imageUrl: ''
  };

  constructor() {
    this.loadProducts();
    this.loadCategories();
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

  loadCategories() {
    this.categoriesLoading = true;
    this.categoriesError = '';
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = (res?.data ?? []).filter((c) => !!c?._id);
        this.categoriesLoading = false;
      },
      error: () => {
        this.categoriesError = 'Failed to load categories';
        this.categoriesLoading = false;
      },
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  createProduct() {
    if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.categoryId) return;

    if (this.selectedFile) {
      this.uploading = true;
      this.sellerService.uploadProductImage(this.selectedFile).subscribe({
        next: (res: any) => {
          this.newProduct.imageUrl = res.data.url;
          this.submitProduct();
        },
        error: (err: any) => {
          this.uploading = false;
          alert('Failed to upload image');
        }
      });
    } else {
      this.submitProduct();
    }
  }

  submitProduct() {
    this.sellerService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.newProduct = { name: '', description: '', price: 0, stock: 0, categoryId: '', imageUrl: '' };
        this.selectedFile = null;
        this.showForm = false;
        this.uploading = false;
        this.loadProducts();
      },
      error: (err: any) => {
        this.uploading = false;
        alert('Failed to create product');
      }
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
