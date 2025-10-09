import { Component } from '@angular/core';

@Component({
  selector: 'admin-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  menuItems = [
    { label: 'Edit Role', route: 'roles', icon: 'view_agenda' },
    { label: 'View Parcel History', route: 'parcels', icon: 'add_ad' }
  ];
}
