import { Component } from '@angular/core';
import { LoaderService } from '../../../core/service/loader.service';

@Component({
  selector: 'admin-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
constructor(public loaderService:LoaderService){}
  menuItems = [
    { label: 'Edit Role', route: 'roles', icon: 'view_agenda' },
    { label: 'View Parcel History', route: 'parcels', icon: 'add_ad' }
  ];
}
