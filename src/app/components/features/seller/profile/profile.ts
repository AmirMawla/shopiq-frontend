import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SellerService } from '../../../../services/seller';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private sellerService = inject(SellerService);
  private cdr = inject(ChangeDetectorRef);
  profile: any = null;
  loading = true;
  error = '';
  editMode = false;

  editData = {
    storeName: '',
    bio: '',
  };

  constructor() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.sellerService.getProfile().subscribe({
      next: (res: any) => {
        this.profile = res.data;
        this.editData.storeName = res.data.storeName;
        this.editData.bio = res.data.bio;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'Failed to load profile';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateProfile() {
    this.sellerService.updateProfile(this.editData).subscribe({
      next: (res: any) => {
        this.editMode = false;
        this.loadProfile();
      },
      error: (err: any) => alert('Failed to update profile'),
    });
  }

  closeStore() {
    if (confirm('Are you sure you want to close your store? You will lose your seller status.')) {
      this.sellerService.closeStore().subscribe({
        next: () => {
          alert('Store closed successfully');
        },
        error: (err: any) => alert('Failed to close store'),
      });
    }
  }
}
