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

  users: Users[] = [];
  filteredusers: Users[] = [];
  searchTerm: string = '';

  showPopup = false;
  selectedUserIds: number[] = [];
  notificationData = { company: '', orderId: '' };

  ngOnInit(): void {
    this.service.fetchUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.filteredusers = [...this.users];
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  /** :mag: Filters user list by search term */
  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredusers = this.users.filter((user) =>
      user.name.toLowerCase().includes(term)
    );
  }

  /** :white_check_mark: Handles checkbox selection for individual users */
  toggleUserSelection(userId: number, event: Event): void {
    console.log("TOGGLE")
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      if (!this.selectedUserIds.includes(userId)) {
        this.selectedUserIds.push(userId);
      }
    } else {
      this.selectedUserIds = this.selectedUserIds.filter((id) => id !== userId);
    }
  }

  /** :ballot_box_with_check: Select or deselect all users in the filtered list */
  toggleSelectAll(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedUserIds = input.checked
      ? this.filteredusers.map((u) => u.id)
      : [];
  }

  /** :incoming_envelope: Opens the popup modal */
  openNotificationPopup(): void {
    if (this.selectedUserIds.length === 0) return;
    this.notificationData = { company: '', orderId: '' };
    this.showPopup = true;
  }

  /** :x: Closes the popup modal */
  closePopup(): void {
    this.showPopup = false;
  }

  /** :rocket: Sends notifications to all selected users */
  confirmNotification(): void {
    if (this.selectedUserIds.length === 0) return;

    const { company, orderId } = this.notificationData;
    const message = `Order from ${company} with Order ID: ${orderId} received at the reception desk. Please confirm if you want to receive it.`;

    let successCount = 0;
    let errorCount = 0;

    this.selectedUserIds.forEach((userId) => {
      this.service.sendNotification(userId, message).subscribe({
        next: () => successCount++,
        error: () => errorCount++,
        complete: () => {
          // Show alert once all notifications are done
          if (successCount + errorCount === this.selectedUserIds.length) {
            alert(
              `Notifications sent: ${successCount} successful, ${errorCount} failed.`
            );
            this.closePopup();
          }
        },
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
