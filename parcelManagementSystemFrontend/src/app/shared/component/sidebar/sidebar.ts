import { UserListComponent } from './../../../feature/receptionist/user-list/user-list.component';
import { Component, Input } from '@angular/core';
import { AuthService } from '../../../core/service/auth-service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(private authService: AuthService) {
    authService.userDetails().subscribe((res)=>{this.user=res})
  }
  @Input() menuItems: Array<Menu> | undefined;

  collapsed = false;

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    this.authService.logout();
  }

  user:User={name:'',role:'',picture:'',email:''};
}
type User = {
  name: string;
  role: string;
  email: string;
  picture:string
};
type Menu = { label: string; route: string; icon: any };
