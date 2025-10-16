import { Component } from '@angular/core';
import { ReceptionistApiService } from '../../../core/service/receptionist-api.service';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  constructor(private service: ReceptionistApiService) {}
  ngOnInit(): any {
    this.service.fetchUsers().subscribe((res) => {
      this.users = res;
      this.filteredusers = this.users;
    });
  }
  users: Array<Users> = [];
  filteredusers: Array<Users> = [];

  searchTerm: string = '';
  onSearch() {
    this.filteredusers = this.users.filter((user) =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  showPopup = false;
  selectedUserId: number | null = null;
  notificationData = { company: '', orderId: '' };

  openNotificationPopup(userId: number) {
    this.selectedUserId = userId;
    this.notificationData = { company: '', orderId: '' };
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  confirmNotification() {
    if (!this.selectedUserId) return;

    this.callSendNotificationAPI(
      this.selectedUserId,
      this.notificationData.company,
      this.notificationData.orderId
    );

    this.closePopup();
  }

  callSendNotificationAPI(userId: number, company: string, orderId: string) {
    this.service
      .sendNotification(
        userId,
        `Order from ${company} with Order Id: ${orderId} received at the reception desk, Please Confirm if you want to receive it `
      )
      .subscribe(() => {
        alert('Notification sent successfully!');
      });
  }
}
type Users = { id: number; name: string; email: string };
