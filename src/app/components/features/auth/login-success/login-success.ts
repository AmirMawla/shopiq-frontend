import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-success.html',
  styleUrls: ['../auth-shared.css', './login-success.css'],
})
export class LoginSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  userName = '';
  userProfilePic = '';

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    const userString = this.route.snapshot.queryParamMap.get('user');

    if (token && userString) {
      try {
        const userData = JSON.parse(userString);
        this.userName = userData.name;
        this.userProfilePic = userData.profilePicture?.url;
        this.authService.handleAuthSuccess({ token, user: userData });

        const userRole = userData?.role;
        setTimeout(() => {
          userRole === 'customer'
            ? this.navigateToHome()
            : userRole === 'admin'
              ? this.navigateToAdmin()
              : this.navigateToSeller();
        }, 2000);
      } catch (error) {
        this.router.navigate(['/auth/login']);
      }
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
  navigateToAdmin() {
    this.router.navigate(['/admin']);
  }
  navigateToSeller() {
    this.router.navigate(['/seller']);
  }
}
