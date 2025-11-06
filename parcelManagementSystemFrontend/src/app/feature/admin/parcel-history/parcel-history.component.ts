import { Component } from '@angular/core';
import { AdminApiService } from '../../../core/service/admin-api.service';
import { DatePipe, CommonModule } from '@angular/common';
@Component({
  selector: 'app-parcel-history',
  standalone: false,
  templateUrl: './parcel-history.component.html',
  styleUrl: './parcel-history.component.css',
})
export class ParcelHistoryComponent {
  constructor(private service: AdminApiService) {}

  parcels: Array<Parcel> = [];
  parcelsResponse: Array<Parcel> = [];
  filteredParcels: Array<Parcel> = [];
  selectedFilter: string = 'ALL';

  ngOnInit(): void {
    this.loadParcels();
  }

  setParcels() {
    this.parcelsResponse = this.parcels.map((parcel) => ({ ...parcel }));
    this.filteredParcels = this.parcelsResponse.map((parcel) => ({ ...parcel }));
    console.log('Response', this.parcelsResponse);
  }

  loadParcels(): void {
    this.service.fetchParcel().subscribe({
      next: (res) => {
        this.parcels = res;
        this.setParcels();
        console.log('Parcels=', res);
      },
      error: (err) => {
        console.log('Error while fetching parcels', err);
      },
    });
  }

  // filterParcels(): void {
  //   if (this.selectedFilter === 'ALL') {

  //   } else {
  //     this.filteredParcels = this.parcels.filter(
  //       p => p.status === this.selectedFilter
  //     );
  //   }
  // }

  printParcels(): void {
    console.log('ParcelsResponse:', this.parcelsResponse);
    console.log('Parcel:', this.parcels);
  }
  updatedParcels:Array<{id:number,status:string}>=[]

  saveAllStatus(): void {
    for (let i: number = 0; i < this.parcels.length; i++) {
      if(this.parcels[i].status!==this.parcelsResponse[i].status){
        console.log("original parcel",this.parcels[i].status)
        console.log("Response parcel",this.parcelsResponse[i].status)
      // this.updatedParcels = this.parcelsResponse.map((parcel) => ({
      //   id: parcel.id,
      //   status: parcel.status,
      // }))
      this.updatedParcels.push({id:this.parcelsResponse[i].id,status:this.parcelsResponse[i].status})
      ;}
    }
    console.log('Updated Users:', this.updatedParcels);

    this.service.updateParcelStatus(this.updatedParcels).subscribe({
      next: () => {
        alert('Status Updated Successfully');
        this.loadParcels();
      },
      error: (err) => {
        console.error('Error updating roles:', err);
        alert('Failed to update status. Please try again.');
      },
    });
  }
}
type Parcel = {
  id: number;
  shortcode: string;
  recipientName: string;
  status: string;
  description: string;
  createdAt: string;
};
