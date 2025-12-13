import { Component, OnInit } from '@angular/core';
import { ReceptionistApiService } from '../../../core/service/receptionist-api.service';
import { SidebarService } from '../../../shared/services/sidebar'; // Add this import

@Component({
  selector: 'app-parcel-history',
  standalone: false,
  templateUrl: './parcel-history.component.html',
  styleUrl: './parcel-history.component.css',
})
export class ParcelHistoryComponent implements OnInit {
  // Add SidebarService to constructor
  constructor(
    private service: ReceptionistApiService,
    public sidebarService: SidebarService
  ) {}

  length: number = 0;
  parcels: Array<Parcel> = [];

  ngOnInit(): void {
    this.loadParcels(0);
  }

  loadParcels(pageIndex: number): void {
    this.service.fetchParcelHistory(pageIndex).subscribe({
      next: (res) => {
        this.parcels = res.content;
        this.length = res.page.totalElements;
      },
      error: (err) => {
        console.error('Error fetching parcels:', err);
      }
    });
  }

  onPageChange(event: any): void {
    this.loadParcels(event.pageIndex);
  }
}

type Parcel = {
  id: number;
  shortcode: string;
  recipientName: string;
  status: string;
  description: string;
  parcelName: string;
  createdAt: string;
};