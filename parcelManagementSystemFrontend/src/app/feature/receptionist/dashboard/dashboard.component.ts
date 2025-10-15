import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../core/service/loader.service';
import { NotificationService } from '../../../core/service/notification.service';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { ReceptionistApiService } from '../../../core/service/receptionist-api.service';

@Component({
  selector: 'receptionist-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class ReceptionistDashboardComponent implements OnInit {
  notifications: Array<notification> = [];
  notificationsFromDb: Array<notification> = [];
  showNotifications = false;
  hasNewNotifications = false;

  constructor(
    public loaderService: LoaderService,
    private notificationService: NotificationService,
    private cookieService: CookieService,
    private receptionistService: ReceptionistApiService
  ) {}
  token = '';
  decodeToken() {
    this.token = this.cookieService.get('accessToken');
    const decoded = jwtDecode<jwtPayload>(this.token);
    console.log(decoded.sub);

    return decoded.sub;
  }
  ngOnInit(): void {
    this.notificationService.subscribeToReceptionistNotifications(this.decodeToken());

    this.notificationService.notifications$.subscribe((n) => {
      this.notifications = n;
      console.log('from receptionist dashboard', this.notifications);
      if (this.notifications.length > 0) this.hasNewNotifications = true;
    });

    this.receptionistService.getNotifications().subscribe((res) => {
      this.notificationsFromDb = res;
    });
  }
  menuItems = [
    { label: 'Active Parcels', route: 'parcels', icon: 'apps' },
    { label: 'View Users', route: 'users', icon: 'view_agenda' },
    { label: 'Create New Parcel', route: 'parcels/create', icon: 'add_ad' },
    { label: 'Parcel History', route: 'parcels/history', icon: 'history' },
  ];
  toggleNotifications() {
    this.showNotifications = !this.showNotifications; // When user opens the dropdown, mark as read (remove red dot)
    if (this.showNotifications) {
      this.receptionistService.getNotifications().subscribe((res) => {
        this.notificationsFromDb = res;
        console.log('data from db ', this.notificationsFromDb);
      });
      this.hasNewNotifications = false;
    }
  }
  closeNotification(id: number, i: number) {
    console.log('id ', i);

    this.receptionistService.changeStatus(id).subscribe(() => {
      console.log('submitted');
      if (this.notificationsFromDb.length != 1) {
        this.notificationsFromDb.splice(i, 1);
        this.notifications.pop();
      } else {
        this.notificationsFromDb = [];
        this.notifications.pop();

      }
    });
  }
}
type notification = {
  id: number;
  message: string;
  senderName: string;
  status: string;
};
interface jwtPayload {
  role: string;
  sub: string;
}
