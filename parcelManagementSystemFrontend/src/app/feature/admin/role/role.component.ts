import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../../core/service/admin-api.service';

@Component({
  selector: 'app-role',
  standalone: false,
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit{

  showPopup:boolean=false;

  selectedUser : Users | null = null;
  popupData = {
    role : ''
  }
  closePopup() {
    this.showPopup = false;
  }

  openPopup(id : number) {
    this.showPopup = true;
    this.selectedUser = this.users.find((user:Users) => user.id === id) || null;
    console.log(this.selectedUser);
  }


  constructor(private service:AdminApiService){}
    ngOnInit():any{
      this.service.fetchUsers().subscribe({
        next: (res) => {
          this.users = res;
          console.log(res);
        },
        error:(err)=>{
          console.log(err); }
      }
        
      //   (res)=>{
      //   this.users=res;
      //   console.log(res);
      // }
    )}
  users:any=[
    // {id:1,name:'Akshaj',email:'akshajbasur@gmail.com'},
  ]


  submitPopup(role : string){
    console.log(role);
    
    this.service.updateUserRole(this.selectedUser?.id!,role).subscribe((res)=>{
      console.log(res);
      this.ngOnInit();
      this.closePopup();
    })

  }
}
  type Users={id:number,name:string,email:string}