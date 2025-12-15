import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../core/service/auth-service';
import { InstallService } from '../../../core/service/install.service';
import { SidebarService } from '../../services/sidebar';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  @Input() menuItems: Array<Menu> | undefined;

  user: User = { name: '', role: '', picture: '', email: '' };

  constructor(
    private authService: AuthService,
    public sidebarService: SidebarService,
    private installService: InstallService
  ) {
    this.authService.userDetails().subscribe((res) => {
      this.user = res;
    });
  }

  ngOnInit() {
    // Service automatically handles mobile detection and state
  }

  isInstalled() {
    return this.installService.isInstalled();
  }

  async onInstallClick(event: Event) {
    event?.preventDefault?.();

    try {
      const result = await this.installService.promptInstall();
      console.log('[Install] result =', result);
      
      if (result === 'no-prompt') {
        alert('If you are on iOS: open Safari → tap Share → "Add to Home Screen" to install the app.');
      }
    } catch (err) {
      console.error('Install prompt error', err);
    }
  }

  onMenuItemClick() {
    // Close sidebar after menu selection on mobile
    if (this.sidebarService.isMobile) {
      this.sidebarService.toggleSidebar();
    }
  }
  

  logout() {
    this.authService.logout();
  }
}

type User = {
  name: string;
  role: string;
  email: string;
  picture: string;
};

type Menu = {
  label: string;
  route: string;
  icon: any;
};