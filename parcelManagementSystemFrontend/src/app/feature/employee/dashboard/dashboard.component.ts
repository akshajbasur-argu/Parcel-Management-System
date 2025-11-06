import { AuthService } from './../../../core/service/auth-service';
import { Component } from '@angular/core';
import { NotificationService } from '../../../core/service/notification.service';
import { EmployeeApiService } from '../../../core/service/employee-api.service';
import { LoaderService } from '../../../core/service/loader.service';

@Component({
  selector: 'employee-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  userId: number = 0;
  hasNewNotifications = false;
  constructor(
    private notificationService: NotificationService,
    private employeeService: EmployeeApiService,
    public loaderService: LoaderService
  ) {
    this.employeeService.getUserId().subscribe((res) => {(this.notificationService.subscribeToEmployeeNotifications(res))

    });
    this.notificationService.notifications$.subscribe((n) => (this.notifications = n));

    this.employeeService.getNotifications().subscribe((res) => {
      this.notificationsFromDb = res;
    });
  }
  menuItems = [{ label: 'Parcel History', route: 'parcels', icon: 'history' }];

  notificationsFromDb: Array<notifications> = [];
  notifications: Array<notifications> = [];
  showNotification: boolean = false;

  openNotification() {

    this.showNotification = !this.showNotification;
  }
  toggleNotification() {
    if (!this.showNotification) {
      this.employeeService.getNotifications().subscribe((res) => {

        this.notificationsFromDb = res;
      });
    }
    // setTimeout(() => {
    this.showNotification = !this.showNotification;
    // }, 500);
  }
  closeNotification() {
    this.showNotification = false;
  }
  submit(status: string, sender: number, index: number, id: number) {
    this.employeeService.submitStatus(status, sender, id).subscribe((res) => {
    });
    this.notificationsFromDb.splice(index, 1);
    this.notifications.pop();
    if(this.notificationsFromDb.length===0)
    {this.showNotification=false;}
  }
}
type notifications = {
  id: number;
  senderId: number;
  status: string;
  message: string;
  senderName: string;
};
