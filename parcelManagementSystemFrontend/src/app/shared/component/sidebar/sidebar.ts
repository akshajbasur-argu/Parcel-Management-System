import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
   @Input() menuItems:Array<Menu> | undefined
}
type Menu={label:string,route:string,icon:any}