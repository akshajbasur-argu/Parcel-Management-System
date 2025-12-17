import { Component } from '@angular/core';
import { ReceptionistApiService } from '../../../core/service/receptionist-api.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  constructor(private service: ReceptionistApiService) {}

  users: Users[] = [];
  filteredusers: Users[] = [];

  pageIndex = 0;
  pageSize = 2;
  length = 0;
searchDebounce: any;

  searchTerm = '';

  selectedUserIds: number[] = [];
  showPopup = false;
  notificationData = { company: '', orderId: '' };

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.service.getPaginatedUsers(this.pageIndex, this.pageSize, this.searchTerm).subscribe({
      next: (res) => {
        this.users = res;
        this.filteredusers = [...this.users];

        this.length = res.page.totalElements;
      },
      error: (err) => console.error(err),
    });
  }

  onSearch() {
     clearTimeout(this.searchDebounce);

  this.searchDebounce = setTimeout(() => {
    this.pageIndex = 0;
    this.loadUsers();
  }, 400);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  toggleUserSelection(userId: number, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      if (!this.selectedUserIds.includes(userId)) {
        this.selectedUserIds.push(userId);
      }
    } else {
      this.selectedUserIds = this.selectedUserIds.filter((id) => id !== userId);
    }
  }

  toggleSelectAll(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedUserIds = input.checked ? this.filteredusers.map(u => u.id) : [];
  }

  openNotificationPopup() {
    if (this.selectedUserIds.length === 0) return;
    this.notificationData = { company: '', orderId: '' };
    this.showPopup = true;
  }
  closePopup() {
    this.showPopup = false;
  }

  confirmNotification() {
    if (this.selectedUserIds.length === 0) return;

    const { company, orderId } = this.notificationData;
    const message = `Order from ${company} with Order ID: ${orderId} received at the reception desk.`;

    let done = 0;
    this.selectedUserIds.forEach((id) => {
      this.service.sendNotification(id, message).subscribe(() => {
        done++;
        if (done === this.selectedUserIds.length) {
          alert("Notification sent");
          this.closePopup();
        }
      });
    });
  }

  toggleUserCard(userId: number): void {
  if (this.selectedUserIds.includes(userId)) {
    this.selectedUserIds = this.selectedUserIds.filter(id => id !== userId);
  } else {
    this.selectedUserIds.push(userId);
  }
}

}

type Users = { id: number; name: string; email: string };
