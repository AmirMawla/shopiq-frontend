import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../services/users';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-edit-user-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-user-details.html',
  styleUrls: ['./edit-user-details.css'],
})
export class EditUserDetails implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  profileForm!: FormGroup;
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit() {
    const user = this.authService.currentUser();

    this.profileForm = this.fb.group({
      name: [
        user?.name || '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
      ],
      birthdate: [user?.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : ''],
      phone: [user?.phone || '', [Validators.pattern(/^\+?[\d\s\-().]{7,20}$/)]],
      address: this.fb.group({
        street: [user?.address?.street || ''],
        city: [user?.address?.city || ''],
        state: [user?.address?.state || ''],
        country: [user?.address?.country || ''],
        zipCode: [user?.address?.zipCode || ''],
      }),
      profilePicture: this.fb.group({
        url: [user?.profilePicture?.url || ''],
        fileId: [user?.profilePicture?.fileId || ''],
      }),
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      console.error('Form is invalid:', this.profileForm.errors);
      // Mark all as touched to show errors in UI
      this.profileForm.markAllAsTouched();
      this.errorMessage.set('Please fix the errors in the form before saving.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Filter out empty values to match Joi expectations
    const formValue = this.cleanFormValue(this.profileForm.value);

    this.userService.updateMe(formValue).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.successMessage.set('Profile updated successfully!');
        // Small delay so user sees success message
        setTimeout(() => this.router.navigate(['/profile']), 1500);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          err.error?.message || 'An error occurred while updating your profile',
        );
        console.error('Update Error:', err);
      },
    });
  }

  private cleanFormValue(obj: any): any {
    const clean: any = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        const nested = this.cleanFormValue(obj[key]);
        if (Object.keys(nested).length > 0) clean[key] = nested;
      } else if (obj[key] !== null && obj[key] !== '') {
        clean[key] = obj[key];
      }
    });
    return clean;
  }
}
