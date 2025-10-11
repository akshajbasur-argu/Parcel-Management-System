import { Component } from '@angular/core';
import { EmployeeApiService } from '../../../core/service/employee-api.service';
import { NotificationService } from '../../../core/service/notification.service';

@Component({
  selector: 'app-parcel-history',
  standalone: false,
  templateUrl: './parcel-history.component.html',
  styleUrl: './parcel-history.component.css'
})
export class ParcelHistoryComponent {

   constructor(private service: EmployeeApiService,private notificationService:NotificationService) { }
   
     parcels: Array<Parcel> = []
     filteredParcels: Array<Parcel> = []
     selectedFilter: string = 'ALL';
     
   
     ngOnInit():void{
       this.loadParcels();
       this.notificationService.subscribeToEmployeeNotifications(2);
     }
   
   setParcels() {
     this.filteredParcels = this.parcels.map(parcel => ({ ...parcel }));
   }
   
   loadParcels():void {
     this.service.fetchParcel().subscribe({
       next:(res) =>{
         this.parcels=res;
         this.setParcels()
         console.log("Parcels=",res);
         console.log("FilteredParcels=",this.filteredParcels);
         
       },
       error:(err)=>{
         console.log("Error while fetching parcels",err);
       }
     });
     }
     
   }
     type Parcel = {
       id: number,
       shortcode: string,
       parcelName: string,
       status: string,
       description: string,
       createdAt: string
     }