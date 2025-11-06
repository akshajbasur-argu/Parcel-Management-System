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

  users: Users[] = [];
  userResponse: Array<Users> = [];
  filteredUsers: Users[] = [];
  searchTerm: string = '';

  loadUsers(): void {
    this.service.fetchUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.userResponse = this.users.map((user) => ({ ...user }));
        this.filteredUsers = [...this.users];
        console.log('Users=', res);
      },
      error: (err) => {
        console.log('Error while fetching users', err);
      },
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) ||
      user.id.toString().includes(term)
    );
  }

  updatesUsers: Array<{ id: number; role: string }> = [];

  saveAllRoles(): void {
    this.updatesUsers = [];

    for (let i: number = 0; i < this.users.length; i++) {
      if (this.users[i].role !== this.userResponse[i].role) {
        console.log('Original role:', this.userResponse[i].role);
        console.log('Updated role:', this.users[i].role);
        this.updatesUsers.push({ 
          id: this.users[i].id, 
          role: this.users[i].role 
        });
      }
    }

    if (this.updatesUsers.length === 0) {
      alert('No changes to save');
      return;
    }

    console.log('Users to update:', this.updatesUsers);

    this.service.updateUserRole(this.updatesUsers).subscribe({
      next: () => {
        alert('Roles Updated Successfully');
        this.searchTerm = '';
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error updating roles:', err);
        alert('Failed to update roles. Please try again.');
      },
    });
  }
}

type Users = { id: number; name: string; email: string; role: string };