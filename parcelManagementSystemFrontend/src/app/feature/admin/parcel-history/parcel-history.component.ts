// import { Component } from '@angular/core';
// import { AdminApiService } from '../../../core/service/admin-api.service';
// import { DatePipe, CommonModule } from '@angular/common';
// @Component({
//   selector: 'app-parcel-history',
//   standalone: false,
//   templateUrl: './parcel-history.component.html',
//   styleUrl: './parcel-history.component.css',
// })
// export class ParcelHistoryComponent {
//   constructor(private service: AdminApiService) {}

//   parcels: Array<Parcel> = [];
//   parcelsResponse: Array<Parcel> = [];
//   filteredParcels: Array<Parcel> = [];
//   selectedFilter: string = 'ALL';

//   ngOnInit(): void {
//     this.loadParcels();
//   }

//   setParcels() {
//     this.parcelsResponse = this.parcels.map((parcel) => ({ ...parcel }));
//     this.filteredParcels = this.parcelsResponse.map((parcel) => ({ ...parcel }));
//     console.log('Response', this.parcelsResponse);
//   }

//   loadParcels(): void {
//     this.service.fetchParcel().subscribe({
//       next: (res) => {
//         this.parcels = res;
//         this.setParcels();
//         console.log('Parcels=', res);
//       },
//       error: (err) => {
//         console.log('Error while fetching parcels', err);
//       },
//     });
//   }


//   printParcels(): void {
//     console.log('ParcelsResponse:', this.parcelsResponse);
//     console.log('Parcel:', this.parcels);
//   }
//   updatedParcels:Array<{id:number,status:string}>=[]

//   saveAllStatus(): void {
//     for (let i: number = 0; i < this.parcels.length; i++) {
//       if(this.parcels[i].status!==this.parcelsResponse[i].status){
      
//       this.updatedParcels.push({id:this.parcelsResponse[i].id,status:this.parcelsResponse[i].status})
//       ;}
//     }

//     this.service.updateParcelStatus(this.updatedParcels).subscribe({
//       next: () => {
//         alert('Status Updated Successfully');
//         this.loadParcels();
//       },
//       error: (err) => {
//         console.error('Error updating roles:', err);
//         alert('Failed to update status. Please try again.');
//       },
//     });
//   }
// }
// type Parcel = {
//   id: number;
//   shortcode: string;
//   recipientName: string;
//   status: string;
//   description: string;
//   createdAt: string;
// };

import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../../core/service/admin-api.service';
import { SidebarService } from '../../../shared/services/sidebar';
import { DatePipe, CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-parcel-history',
  standalone: false,
  templateUrl: './parcel-history.component.html',
  styleUrl: './parcel-history.component.css',
})
export class ParcelHistoryComponent implements OnInit {
  constructor(
    private service: AdminApiService,
    public sidebarService: SidebarService
  ) {}

  isMobile:boolean = false;
  parcels: Array<Parcel> = [];
  parcelsResponse: Array<Parcel> = [];
  filteredParcels: Array<Parcel> = [];
  selectedFilter: string = 'ALL';
  sidebarCollapsed: boolean = false;

  pageIndex = 0;
  pageSize = 2;
  length = 0;





  ngOnInit(): void {
    this.loadParcels();
  }

  setParcels() {
    this.parcelsResponse = this.parcels.map((parcel) => ({ ...parcel }));
    this.filteredParcels = this.parcelsResponse.map((parcel) => ({ ...parcel }));
  }

      checkMobile() {
  this.isMobile = window.innerWidth < 768;
}

    toggleSidebar() {
  // Emit event to parent or use a service to toggle sidebar
    this.sidebarService.toggleSidebar();
}

  loadParcels(): void {
    let filter = null;
    if(this.selectedFilter != "ALL") filter = this.selectedFilter;
    this.service.getPaginatedParcels(this.pageIndex,this.pageSize,filter).subscribe({
      next: (res) => {
        this.parcels = res.content;
        this.setParcels();
        this.length=res.page.totalElements
      },
      error: (err) => {
        console.log('Error while fetching parcels', err);
      },
    });
  }

  onFilterChange(){
   this.loadParcels();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadParcels();
  }



  shouldShowParcel(parcel: Parcel, filter: string): boolean {
    if (filter === 'ALL') return true;
    return parcel.status === filter;
  }

  updatedParcels: Array<{ id: number; status: string }> = [];

  saveAllStatus(): void {
    // this.updatedParcels = [];
    
    // for (let i: number = 0; i < this.parcels.length; i++) {
    //   if (this.parcels[i].status !== this.parcelsResponse[i].status) {
    //     this.updatedParcels.push({
    //       id: this.parcelsResponse[i].id,
    //       status: this.parcelsResponse[i].status
    //     });
    //   }
    // }

    if (this.updatedParcels.length === 0) {
      alert('No changes to save');
      return;
    }

    this.service.updateParcelStatus(this.updatedParcels).subscribe({
      next: () => {
        alert('Status Updated Successfully');
        this.loadParcels();
      },
      error: (err) => {
        console.error('Error updating status:', err);
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