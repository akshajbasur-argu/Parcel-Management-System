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

    return decoded.sub;
  }
  ngOnInit(): void {
    this.notificationService.subscribeToReceptionistNotifications(this.decodeToken());

    this.notificationService.notifications$.subscribe((n) => {
      this.notifications = n;
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
    { label: 'Scan Invoice', route: '/invoice', icon:'receipt'}
  ];
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.receptionistService.getNotifications().subscribe((res) => {
        this.notificationsFromDb = res;
      });
      this.hasNewNotifications = false;
    }
  }
  closeNotification(id: number, i: number) {

    this.receptionistService.changeStatus(id).subscribe(() => {
      if (this.notificationsFromDb.length != 1) {
        this.notificationsFromDb.splice(i, 1);
        this.notifications.pop();
      } else {
        this.notificationsFromDb = [];
        this.notifications.pop();

      }

      if(this.notificationsFromDb.length===0){ this.showNotifications=false}
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
