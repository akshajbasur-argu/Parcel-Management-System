import { Component, Input } from '@angular/core';
import { AuthService } from '../../../core/service/auth-service';


@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  constructor(private authService:AuthService){}
   @Input() menuItems:Array<Menu> | undefined
 collapsed = false;

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

   logout(){
    this.authService.logout();
   }
}
type Menu={label:string,route:string,icon:any}
