import { Component, inject } from '@angular/core';
import { AdminService } from '../../../../services/admin';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {
  private adminService = inject(AdminService);

  users: any[] = [];
  pendingSellers: any[] = [];
  loading = true;
  error = '';

  constructor() {
    this.loadUsers();
    this.loadPendingSellers();
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load users';
        this.loading = false;
      }
    });
  }

  loadPendingSellers() {
    this.adminService.getPendingSellers().subscribe({
      next: (res: any) => {
        this.pendingSellers = res.data;
      },
      error: (err: any) => console.log(err)
    });
  }

  toggleRestriction(id: string) {
    this.adminService.toggleRestriction(id).subscribe({
      next: (res: any) => {
        const user = this.users.find(u => u._id === id);
        if (user) {
          user.isRestricted = !user.isRestricted;
        }
      },
      error: (err: any) => alert('Failed to update user')
    });
  }

  decideSeller(id: string, decision: string) {
    this.adminService.decideSellerApplication(id, decision).subscribe({
      next: () => {
        this.loadUsers();
        this.loadPendingSellers();
      },
      error: (err: any) => alert('Failed to process application')
    });
  }
}
