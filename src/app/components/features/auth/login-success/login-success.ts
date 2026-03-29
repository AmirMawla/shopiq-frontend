import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-success.html',
  styleUrls: ['../auth-shared.css'],
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
      } catch (error) {
        console.error('❌ Parsing error', error);
        this.router.navigate(['/auth/login']);
      }
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
  navigateToHome() {
    this.router.navigate(['/']);
  }
}
