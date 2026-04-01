import { Component, DoCheck, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

export interface NavItem {
  label: string;
  route: string;
  badge?: number;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent implements DoCheck {
  @Input() sections: NavSection[] = [];
  @Input() showUserFooter = true;
  public authService = inject(AuthService);


  avatarImageFailed = false;
  private lastProfilePictureUrl: string | null | undefined = undefined;

  ngDoCheck(): void {
    const url = this.authService.currentUser()?.profilePicture?.url ?? null;
    if (url !== this.lastProfilePictureUrl) {
      this.lastProfilePictureUrl = url;
      this.avatarImageFailed = false;
    }
  }


  avatarLetter(): string {
    const role = this.authService.currentUser()?.role;
    if (role === 'seller') return 'S';
    if (role === 'admin') return 'A';
    return 'U';
  }

  avatarRoleClass(): Record<string, boolean> {
    const role = this.authService.currentUser()?.role;
    return {
      'sb-avatar-initial--seller': role === 'seller',
      'sb-avatar-initial--admin': role === 'admin',
      'sb-avatar-initial--user': role !== 'seller' && role !== 'admin',
    };
  }

  onAvatarError(): void {
    this.avatarImageFailed = true;
  }
}
