import { Component, inject } from '@angular/core';
import { AdminService } from '../../../../services/admin';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories {
  private adminService = inject(AdminService);

  categories: any[] = [];
  loading = true;
  error = '';
  newCategoryName = '';
  showForm = false;

  constructor() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.adminService.getAllCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load categories';
        this.loading = false;
      }
    });
  }

  createCategory() {
    if (!this.newCategoryName) return;
    this.adminService.createCategory({ name: this.newCategoryName }).subscribe({
      next: (res: any) => {
        this.newCategoryName = '';
        this.showForm = false;
        this.loadCategories();
      },
      error: (err: any) => alert('Failed to create category')
    });
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.adminService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err: any) => alert('Failed to delete category')
      });
    }
  }
}
