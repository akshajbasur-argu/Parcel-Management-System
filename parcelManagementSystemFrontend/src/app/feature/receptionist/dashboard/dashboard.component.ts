import { Component } from '@angular/core';

@Component({
  selector: 'receptionist-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class ReceptionistDashboardComponent {
  menuItems = [
    { label: 'View Users', route: 'users', icon: 'view_agenda' },
    { label: 'Active Parcels', route: 'parcels', icon: 'box' },
    { label: 'Create New Parcel', route: 'parcels/create', icon: 'add_ad' },
    { label: 'Parcel History', route: 'parcels/history', icon: 'history' }
  ];

}
