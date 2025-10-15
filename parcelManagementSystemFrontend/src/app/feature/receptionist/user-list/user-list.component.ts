import { Component } from '@angular/core';
import { ReceptionistApiService } from '../../../core/service/receptionist-api.service';
import { NotificationService } from '../../../core/service/notification.service';


@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  constructor(private service: ReceptionistApiService, private notificationService: NotificationService) {

  }
  ngOnInit(): any {
    this.service.fetchUsers().subscribe((res) => {
      this.users = res;
      this.filteredusers=this.users;
      console.log(res);

    });
  }
  users: Array<Users> = [
    // {id:1,name:'Akshaj',email:'akshajbasur@gmail.com'},
    // {id:2,name:'Arun',email:'Arun@gmail.com'}
    // {id:3,name:'Sangam',email:'Sangam@gmail.com'},
    // {id:4,name:'Tanishka',email:'Tanishka@gmail.com'}
  ];
  filteredusers:Array<Users>=[]
//  sendNotification(id: number) {
//   this.service.sendNotification(id).subscribe(() => {
//     alert('Notification sent successfully!');
//   });
// }
  searchTerm:string=''
  onSearch(){
    this.filteredusers=this.users.filter(user=>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    )
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

  console.log('Sending notification to user:', this.selectedUserId);
  console.log('Company:', this.notificationData.company);
  console.log('Order ID:', this.notificationData.orderId);

  // :white_check_mark: Your backend call here
  this.callSendNotificationAPI(
    this.selectedUserId,
    this.notificationData.company,
    this.notificationData.orderId
  );

  this.closePopup();
}

callSendNotificationAPI(userId: number, company: string, orderId: string) {
   this.service.sendNotification(userId,`Order from ${company} with Order Id: ${orderId} received at the reception desk, Please Confirm if you want to receive it `).subscribe(() => {
    alert('Notification sent successfully!');
  });
}


}
type Users = { id: number; name: string; email: string };
