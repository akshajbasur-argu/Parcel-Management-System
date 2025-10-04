import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../../core/service/admin-api.service';

@Component({
  selector: 'app-role',
  standalone: false,
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit{

  constructor(private service:AdminApiService){}

  ngOnInit():void{
    this.loadUsers();
  }

  loadUsers():void {
    this.service.fetchUsers().subscribe({
      next:(res) =>{
        this.users=res;
        console.log("Users=",res);
      },
      error:(err)=>{
        console.log("Error while fetching users",err);
      }
    });
  }

  saveAllRoles():void{
    const updatedUsers = this.users.map(user => ({
      id: user.id,
      role: user.role // Assuming 'role' is a property of user
    }));

    console.log("Updated Users:", updatedUsers);

    this.service.updateUserRole(updatedUsers).subscribe({
      next: () => {
        alert("Roles Updated Successfully");
        this.loadUsers();
      },
      error: (err) => {
        console.error("Error updating roles:", err);
        alert("Failed to update roles. Please try again.");
      }

    })
  }


  users:Users[]=[
    // {id:1,name:'Akshaj',email:'akshajbasur@gmail.com'},
  ]
}


  type Users={id:number,name:string,email:string,role:string}