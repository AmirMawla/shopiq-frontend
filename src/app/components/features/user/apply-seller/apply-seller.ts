import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../services/users';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-apply-seller',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './apply-seller.html',
  styleUrls: ['./apply-seller.css'],
})
export class ApplySeller implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  applyForm!: FormGroup;
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user?.sellerProfile?.storeName) {
      this.router.navigate(['/profile']);
      return;
    }

    this.applyForm = this.fb.group({
      storeName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      bio: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  onSubmit() {
    if (this.applyForm.invalid) {
      this.applyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.userService.applyForSeller(this.applyForm.value).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to submit application');
      },
    });
  }
}
