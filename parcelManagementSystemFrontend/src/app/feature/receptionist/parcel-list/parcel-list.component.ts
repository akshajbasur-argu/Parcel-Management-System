import { Component, ViewChild } from '@angular/core';
import { ReceptionistApiService } from '../../../core/service/receptionist-api.service';
import { Router, RouteReuseStrategy } from '@angular/router';
import { finalize } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from '../../../core/service/notification.service';
// import { MatPaginator, PageEvent } from '@angular/material/paginator';
// import { HttpErrorResponse } from '@angular/common/http';
// import { MatFormField, MatLabel } from '@angular/material/form-field';
// import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-parcel-list',
  standalone: false,
  templateUrl: './parcel-list.component.html',
  styleUrl: './parcel-list.component.css',
})
export class ParcelListComponent {
  constructor(private service: ReceptionistApiService, private router: Router,private cookieService:CookieService,private notificationService: NotificationService) {}
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatFormField) formField!: MatFormField;
  // @ViewChild(MatLabel) label!: MatLabel;
  // @ViewChild(MatIcon) icon!: MatIcon;

  ngOnInit(): any {
    this.getParcels();


  }
  num: number = 0;
  //     // this.parcels = res
  //      if (res && Array.isArray(res.parcels)) {
  //       this.parcels = res.parcels;
  // } else {
  //   // Handle the case where the data is not in the expected format
  //   console.error('API response did not contain an array of parcels:', res);
  //   this.parcels = []; // Assign an empty array to prevent the error
  // }
  getParcels() {
    this.service.fetchActiveParcel(this.num).subscribe((res) => {
      this.parcels = res.content;
      this.filteredparcels = this.parcels;
      this.length = res.page.totalElements;
    });
  }

  parcels: Array<Parcel> = [
  ];
  validate(parcel: Parcel) {
    this.openPopup(parcel);
  }

  loading: number | null = null;

  resend(id: number) {
    this.loading = id;
    this.service
      .resend(id)
      .pipe(
        finalize(() => {
          this.loading = null;
        })
      )
      .subscribe({
        next: (res) => {
          alert('Otp resent successfully');
        },
        error: (err) => {
          alert('Please try again, Message could not be sent');
        },
      });
  }

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

  openPopup(parcel: Parcel) {
    this.selecteditem = parcel;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.popupData = { parcelId: 0, otp: 0 };
  }

  submitPopup(id: number) {
    this.popupData.parcelId = id;
    this.service.validateOtp(this.popupData).subscribe({
      next: (res) => {
        alert('submitted successfully');
        this.getParcels();
      },
      error: (err) => {
        alert('Invalid Otp');
      },
    });
    this.closePopup();
  }
  reloadComponent() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url]);
    });
  }

  length: number = 0;
  pageSize = 5;
  onPageChange(event: any) {
    this.num = event.pageIndex;
    this.getParcels();
  }

  filteredparcels: Array<Parcel> = [];
  searchTerm: string = '';
  onSearch() {
    this.filteredparcels = this.parcels.filter((parcel) =>
      parcel.recipientName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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
