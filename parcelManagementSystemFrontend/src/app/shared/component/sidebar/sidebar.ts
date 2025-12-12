import { UserListComponent } from './../../../feature/receptionist/user-list/user-list.component';
import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../../core/service/auth-service';
import { InstallService } from '../../../core/service/install.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(private authService: AuthService) {
    authService.userDetails().subscribe((res) => { this.user = res })
  }
  @Input() menuItems: Array<Menu> | undefined;

  private installService = inject(InstallService);

  isInstalled(){
    return this.installService.isInstalled(); 
  }
  collapsed = false;
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
  async onInstallIconClick(e: Event) {
    e.preventDefault();
    const result = await this.installService.promptInstall();
    console.log('install prompt result', result);
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    this.authService.logout();
  }

  user: User = { name: '', role: '', picture: '', email: '' };
}
type User = {
  name: string;
  role: string;
  email: string;
  picture: string
};
type Menu = { label: string; route: string; icon: any };
