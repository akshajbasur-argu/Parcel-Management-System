import { Component } from '@angular/core';
import { LoaderService } from '../../../core/service/loader.service';

@Component({
  selector: 'receptionist-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class ReceptionistDashboardComponent {
  constructor(public loaderService: LoaderService){}
  menuItems = [
    { label: 'Active Parcels', route: 'parcels', icon: 'apps' },
    { label: 'View Users', route: 'users', icon: 'view_agenda' },
    { label: 'Create New Parcel', route: 'parcels/create', icon: 'add_ad' },
    { label: 'Parcel History', route: 'parcels/history', icon: 'history' },
  ];

}
