import { Component, inject } from '@angular/core';
import { AdminService } from '../../../../services/admin';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-banners',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './banners.html',
  styleUrl: './banners.css'
})
export class Banners {
  private adminService = inject(AdminService);

  banners: any[] = [];
  loading = true;
  error = '';
  showForm = false;
  uploading = false;
  selectedFile: File | null = null;

  newBanner = {
    title: '',
    imageUrl: '',
    link: '',
    order: 0,
    isActive: true
  };

  constructor() {
    this.loadBanners();
  }

  loadBanners() {
    this.loading = true;
    this.adminService.getAllBanners().subscribe({
      next: (res: any) => {
        this.banners = res.data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load banners';
        this.loading = false;
      }
    });
  }

onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  createBanner() {
    if (!this.newBanner.title) return alert('Please enter a title');
    if (!this.selectedFile) return alert('Please select an image');

    this.uploading = true;
    this.adminService.uploadBannerImage(this.selectedFile).subscribe({
      next: (res: any) => {
        this.newBanner.imageUrl = res.data.url;
        this.adminService.createBanner(this.newBanner).subscribe({
          next: () => {
            this.newBanner = { title: '', imageUrl: '', link: '', order: 0, isActive: true };
            this.selectedFile = null;
            this.showForm = false;
            this.uploading = false;
            this.loadBanners();
          },
          error: (err: any) => {
            this.uploading = false;
            alert('Failed to create banner');
          }
        });
},
      error: (err: any) => {
        this.uploading = false;
        alert('Failed to upload image');
      }
    });
  }

  toggleBanner(id: string) {
    this.adminService.toggleBanner(id).subscribe({
      next: () => {
        const banner = this.banners.find(b => b._id === id);
        if (banner) banner.isActive = !banner.isActive;
      },
      error: (err: any) => alert('Failed to toggle banner')
    });
  }

  deleteBanner(id: string) {
    if (confirm('Are you sure you want to delete this banner?')) {
      this.adminService.deleteBanner(id).subscribe({
        next: () => this.loadBanners(),
        error: (err: any) => alert('Failed to delete banner')
      });
    }
  }
}
