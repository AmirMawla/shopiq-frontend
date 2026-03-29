import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['../auth-shared.css', './forgot-password.css'],
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  currentStep = signal(1);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  userEmail = signal('');

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
  });

  resetForm = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator },
  );

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const pass = control.get('newPassword');
    const confirm = control.get('confirmPassword');
    return pass && confirm && pass.value !== confirm.value ? { mismatch: true } : null;
  }

  onRequestOtp() {
    if (this.emailForm.valid) {
      this.isLoading.set(true);
      const email = this.emailForm.value.email!;
      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.userEmail.set(email);
          this.currentStep.set(2);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Error sending OTP');
          this.isLoading.set(false);
        },
      });
    }
  }

  onVerifyOtp() {
    if (this.otpForm.valid) {
      this.isLoading.set(true);
      this.authService.verifyOtp(this.userEmail(), this.otpForm.value.otp!).subscribe({
        next: () => {
          this.currentStep.set(3);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Invalid OTP');
          this.isLoading.set(false);
        },
      });
    }
  }

  onResetPassword() {
    if (this.resetForm.valid) {
      this.isLoading.set(true);
      const data = { email: this.userEmail(), newPassword: this.resetForm.value.newPassword };
      this.authService.resetPassword(data).subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Reset failed');
          this.isLoading.set(false);
        },
      });
    }
  }
}
