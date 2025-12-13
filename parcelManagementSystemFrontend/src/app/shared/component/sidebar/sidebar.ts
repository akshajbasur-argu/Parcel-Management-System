import { UserListComponent } from './../../../feature/receptionist/user-list/user-list.component';
import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../core/service/auth-service';
import { InstallService } from '../../../core/service/install.service';
import { SidebarService } from '../../services/sidebar';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit{
  constructor(private authService: AuthService,
    public sidebarService: SidebarService
  ) {
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

  isMobile: boolean = false;
  user: User = { name: '', role: '', picture: '', email: '' };

  ngOnInit() {
    // Subscribe to sidebar state changes from service
    this.sidebarService.collapsed$.subscribe(collapsed => {
      this.collapsed = collapsed;
      console.log("collapsed",this.collapsed);
    });
    
    this.sidebarService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
      console.log("isMobile",this.isMobile);
      
    });



  }

  

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  onMenuItemClick() {
    // Close sidebar after menu selection on mobile
    if (this.isMobile) {
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
  picture: string
};

type Menu = { 
  label: string; 
  route: string; 
  icon: any 
};