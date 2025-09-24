import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
   sidebar = true;
  constructor(){
    console.log("hello from sidebar")
  }
  toggleSidebar() {
    this.sidebar = !this.sidebar;

  }

}
