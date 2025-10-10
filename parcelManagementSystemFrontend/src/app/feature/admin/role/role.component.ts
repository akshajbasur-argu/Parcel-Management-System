import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../../core/service/admin-api.service';

@Component({
  selector: 'app-role',
  standalone: false,
  templateUrl: './role.component.html',
  styleUrl: './role.component.css',
})
export class RoleComponent implements OnInit {
  constructor(private service: AdminApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  userResponse: Array<Users> = [];
  loadUsers(): void {
    this.service.fetchUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.userResponse = this.users.map((user) => ({ ...user }));

        console.log('Users=', res);
      },
      error: (err) => {
        console.log('Error while fetching users', err);
      },
    });
  }
  updatesUsers: Array<{ id: number; role: string }> = [];
  saveAllRoles(): void {
    // const updatedUsers = this.users.map(user => ({
    //   id: user.id,
    //   role: user.role
    // }));
    for (let i: number = 0; i < this.users.length; i++) {
      if (this.users[i].role !== this.userResponse[i].role) {
        console.log('original parcel', this.users[i].role);
        console.log('Response parcel', this.users[i].role);
        // this.updatedParcels = this.parcelsResponse.map((parcel) => ({
        //   id: parcel.id,
        //   status: parcel.status,
        // }))
        this.updatesUsers.push({ id: this.users[i].id, role: this.users[i].role });
      }
    }
    console.log(this.updatesUsers);

    this.service.updateUserRole(this.updatesUsers).subscribe({
      next: () => {
        alert('Roles Updated Successfully');
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error updating roles:', err);
        alert('Failed to update roles. Please try again.');
      },
    });
  }

  users: Users[] = [
    // {id:1,name:'Akshaj',email:'akshajbasur@gmail.com'},
  ];
}

type Users = { id: number; name: string; email: string; role: string };
