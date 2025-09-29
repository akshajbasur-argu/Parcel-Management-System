import { Component } from '@angular/core';

@Component({
  selector: 'employee-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  menuItems = [
    { label: 'Parcel History', route: 'parcels', icon: 'history' }
  ];
}
