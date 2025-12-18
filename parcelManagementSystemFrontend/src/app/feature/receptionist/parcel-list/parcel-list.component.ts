import { Component, OnInit } from '@angular/core';
import { ReceptionistApiService } from '../../../core/service/receptionist-api.service';
import { Router } from '@angular/router';
import { finalize, Subject, debounceTime } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from '../../../core/service/notification.service';
import { SidebarService } from '../../../shared/services/sidebar';

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
    public sidebarService: SidebarService
  ) {}

  // Pagination
  num = 0;
  length = 0;
  pageSize = 10;

  // Data
  parcels: Parcel[] = [];
  searchTerm = '';

  // UI state
  loading: number | null = null;
  showPopup = false;

  // Debounce search
  private searchSubject = new Subject<string>();

  // Popup data
  selecteditem: Parcel = {
    id: 0,
    shortcode: '',
    recipientName: '',
    status: '',
    description: '',
    parcelName: '',
    createdAt: '',
  };

  popupData: Otp = {
    parcelId: 0,
    otp: null
  };

  ngOnInit(): void {
    this.getParcels();

    // 🔹 Backend search with debounce
    this.searchSubject
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.num = 0; // reset to first page
        this.getParcels();
      });
  }

  // 🔹 Fetch parcels (pagination + search)
  getParcels(): void {
    this.service.fetchActiveParcel(this.num, this.searchTerm).subscribe({
      next: (res) => {
        this.parcels = res.content;
        this.length = res.page.totalElements;
      },
      error: (err) => {
        console.error('Error fetching parcels:', err);
      }
    });
  }

  // 🔹 Trigger backend search
  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  // 🔹 Pagination change
  onPageChange(event: any): void {
    this.num = event.pageIndex;
    this.getParcels();
  }

  // 🔹 OTP actions
  validate(parcel: Parcel): void {
    this.openPopup(parcel);
  }

  resend(id: number): void {
    this.loading = id;

    this.service.resend(id)
      .pipe(finalize(() => this.loading = null))
      .subscribe({
        next: () => alert('OTP resent successfully'),
        error: () => alert('Please try again, message could not be sent')
      });
  }

  openPopup(parcel: Parcel): void {
    this.selecteditem = parcel;
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.popupData = { parcelId: 0, otp: null };
  }

  submitPopup(id: number): void {
    this.popupData.parcelId = id;

    this.service.validateOtp(this.popupData).subscribe({
      next: () => {
        alert('Validated successfully');
        this.getParcels();
        this.closePopup();
      },
      error: () => {
        alert('Invalid OTP');
        this.closePopup();
      }
    });
  }
}

// ---------------- TYPES ----------------

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
