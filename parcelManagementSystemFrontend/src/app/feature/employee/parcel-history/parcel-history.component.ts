import { Component } from '@angular/core';
import { EmployeeApiService } from '../../../core/service/employee-api.service';
import { NotificationService } from '../../../core/service/notification.service';
import { SidebarService } from '../../../shared/services/sidebar';

@Component({
  selector: 'app-parcel-history',
  standalone: false,
  templateUrl: './parcel-history.component.html',
  styleUrl: './parcel-history.component.css'
})
export class ParcelHistoryComponent {

   constructor(private service: EmployeeApiService,private notificationService:NotificationService, public sidebarService:SidebarService) { }

     parcels: Array<Parcel> = []
     filteredParcels: Array<Parcel> = []
     selectedFilter: string = 'ALL';
     isMobile: boolean = false;
     sidebarCollapsed: boolean = false;


     ngOnInit():void{
       this.loadParcels();
       this.checkMobile();
       window.addEventListener('resize', () => this.checkMobile());


     }

     checkMobile() {
  this.isMobile = window.innerWidth < 768;
}

  toggleSidebar() {
  // Emit event to parent or use a service to toggle sidebar
    this.sidebarService.toggleSidebar();
}

shouldShowParcel(parcel: any, filter: string): boolean {
  if (filter === 'ALL') return true;
  return parcel.status === filter;
}

   setParcels() {
     this.filteredParcels = this.parcels.map(parcel => ({ ...parcel }));
   }

   loadParcels():void {
     this.service.fetchParcel().subscribe({
       next:(res) =>{
         this.parcels=res;
         this.setParcels()


       },
       error:(err)=>{
       }
     });
     }

   }
     type Parcel = {
      recipientId:number
       id: number,
       shortcode: string,
       parcelName: string,
       status: string,
       description: string,
       createdAt: string
     }
