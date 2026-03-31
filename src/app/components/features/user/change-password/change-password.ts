import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css', '../user-shared.css'],
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isLoading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  passwordForm = this.fb.group(
    {
      oldPassword: ['', [Validators.required]],
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

  onSubmit() {
    if (this.passwordForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      const { oldPassword, newPassword } = this.passwordForm.getRawValue();

      this.authService.changePassword({ oldPassword, newPassword }).subscribe({
        next: () => {
          this.successMessage.set('Password updated successfully');
          this.passwordForm.reset();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Update failed');
          this.isLoading.set(false);
        },
      });
    }
  }
}
