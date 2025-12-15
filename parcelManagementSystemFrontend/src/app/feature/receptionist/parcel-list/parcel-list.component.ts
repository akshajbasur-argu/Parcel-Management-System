import { Component, OnInit } from '@angular/core';
import { ReceptionistApiService } from '../../../core/service/receptionist-api.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from '../../../core/service/notification.service';
import { SidebarService } from '../../../shared/services/sidebar'; // Add this

@Component({
  selector: 'app-parcel-list',
  standalone: false,
  templateUrl: './parcel-list.component.html',
  styleUrl: './parcel-list.component.css',
})
export class ParcelListComponent implements OnInit {
  constructor(
    private service: ReceptionistApiService,
    private router: Router,
    private cookieService: CookieService,
    private notificationService: NotificationService,
    public sidebarService: SidebarService // Add this
  ) {}

  ngOnInit(): void {
    this.getParcels();
  }

  num: number = 0;
  length: number = 0;
  pageSize = 10;
  loading: number | null = null;
  
  parcels: Array<Parcel> = [];
  filteredparcels: Array<Parcel> = [];
  searchTerm: string = '';

  showPopup = false;
  selecteditem: Parcel = {
    id: 0,
    shortcode: '',
    recipientName: '',
    status: '',
    description: '',
    createdAt: '',
    parcelName: '',
  };
  popupData: Otp = { parcelId: 0, otp: null };

  getParcels() {
    this.service.fetchActiveParcel(this.num).subscribe({
      next: (res) => {
        this.parcels = res.content;
        this.filteredparcels = this.parcels;
        this.length = res.page.totalElements;
      },
      error: (err) => {
        console.error('Error fetching parcels:', err);
      }
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredparcels = this.parcels;
      return;
    }
    this.filteredparcels = this.parcels.filter((parcel) =>
      parcel.recipientName.toLowerCase().includes(term)
    );
  }

  validate(parcel: Parcel) {
    this.openPopup(parcel);
  }

  resend(id: number) {
    this.loading = id;
    this.service
      .resend(id)
      .pipe(finalize(() => { this.loading = null; }))
      .subscribe({
        next: (res) => {
          alert('OTP resent successfully');
        },
        error: (err) => {
          alert('Please try again, message could not be sent');
        },
      });
  }

  openPopup(parcel: Parcel) {
    this.selecteditem = parcel;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.popupData = { parcelId: 0, otp: null };
  }

  submitPopup(id: number) {
    this.popupData.parcelId = id;
    this.service.validateOtp(this.popupData).subscribe({
      next: (res) => {
        alert('Validated successfully');
        this.getParcels();
        this.closePopup();
      },
      error: (err) => {
        alert('Invalid OTP');
        this.closePopup();
      },
    });
  }

  onPageChange(event: any) {
    this.num = event.pageIndex;
    this.getParcels();
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

type Otp = {
  parcelId: number;
  otp: number | null;
};