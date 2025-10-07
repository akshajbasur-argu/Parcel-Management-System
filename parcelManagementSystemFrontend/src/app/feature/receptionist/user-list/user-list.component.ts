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
      this.filteredusers=this.users;
      console.log(res);
    });
  }
  users: Array<Users> = [
    // {id:1,name:'Akshaj',email:'akshajbasur@gmail.com'},
    // {id:2,name:'Arun',email:'Arun@gmail.com'},
    // {id:3,name:'Sangam',email:'Sangam@gmail.com'},
    // {id:4,name:'Tanishka',email:'Tanishka@gmail.com'}
  ];
  filteredusers:Array<Users>=[]
  sendNotification(id: number) {
    this.service.sendNotification(id).subscribe((res) => {
      alert('Notification sent successfully !!!');
    });
  }
  searchTerm:string=''
  onSearch(){
    this.filteredusers=this.users.filter(user=>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    )
  }
  
}
type Users = { id: number; name: string; email: string };
