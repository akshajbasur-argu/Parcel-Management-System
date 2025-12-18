import { Component } from '@angular/core';
import { EmployeeApiService } from '../../../core/service/employee-api.service';
import { NotificationService } from '../../../core/service/notification.service';
import { SidebarService } from '../../../shared/services/sidebar';
import { filter } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-parcel-history',
  standalone: false,
  templateUrl: './parcel-history.component.html',
  styleUrl: './parcel-history.component.css'
})
export class ParcelHistoryComponent {

  constructor(
    private service: EmployeeApiService,
    private notificationService: NotificationService,
    public sidebarService: SidebarService
  ) { }

  parcels: Array<Parcel> = [];
  parcelsResponse: Array<Parcel> = [];
  filteredParcels: Array<Parcel> = [];
  selectedFilter: string = 'ALL';
  isMobile: boolean = false;
  sidebarCollapsed: boolean = false;
  updatedParcels: Array<{ id: number; status: string }> = [];
  pageIndex = 0;
  pageSize = 2;
  length = 0;

  ngOnInit(): void {
    this.loadParcels();
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.checkMobile());
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  shouldShowParcel(parcel: Parcel, filter: string): boolean {
    if (filter === 'ALL') return true;
    return parcel.status === filter;
  }

  setParcels() {
    // Create a copy for the original parcels
    this.parcelsResponse = this.parcels.map((parcel) => ({ ...parcel }));
    // Create a copy for filtered parcels
    this.filteredParcels = this.parcelsResponse.map((parcel) => ({ ...parcel }));
  }

  loadParcels(): void {
    let filter = null;
    if (this.selectedFilter !=="ALL") filter = this.selectedFilter;
    this.service.getPaginatedParcels(this.pageIndex,this.pageSize,filter).subscribe({
      next: (res) => {
        this.parcels = res.content;
        this.setParcels(); // This now properly initializes parcelsResponse
        console.log('Parcels loaded:', this.parcels);
        this.length=res.page.totalElements;
      },
      error: (err) => {
        console.error('Error while fetching parcels', err);
        alert('Failed to load parcels. Please try again.');
      }
    });
  }

  onFilterChange(){
    this.loadParcels();
  }

  // saveChange(parcel:Parcel
  // ){
  //   this.updatedParcels.push({
  //         id: parcel.id,
  //         status: parcel.status
  //       });

  // } 
  
  onPageChange(event: PageEvent){
    this.pageIndex=event.pageIndex;
    this.pageSize=event.pageSize;
    this.loadParcels();
  }

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
    
    console.log("SAVEALLSTATUS", this.parcelsResponse, this.updatedParcels);
    
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
      }
    });
  }
}

type Parcel = {
  recipientId: number;
  id: number;
  shortcode: string;
  parcelName: string;
  status: string;
  description: string;
  createdAt: string;
}