import { Component, ViewChild } from '@angular/core';
import { ReceptionistApiService } from '../../../core/service/receptionist-api.service';
import { Router, RouteReuseStrategy } from '@angular/router';
import { finalize } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-parcel-list',
  standalone: false,
  templateUrl: './parcel-list.component.html',
  styleUrl: './parcel-list.component.css',
})
export class ParcelListComponent {
  constructor(private service: ReceptionistApiService, private router: Router) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
      console.log(res)
      this.parcels = res.content;
      this.length = res.totalElements;

    });
  }
  parcels: Array<Parcel> = [
    //   { id: 1, shortcode: 'Random', recipientName: 'Akshaj', status: 'Received' },
    // { id: 2, shortcode: 'Random', recipientName: 'Vishwa', status: 'Received' },
    // { id: 3, shortcode: 'Random', recipientName: 'Tanishka', status: 'Received' },
    // { id: 4, shortcode: 'Random', recipientName: 'Arun', status: 'Received' }
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
      .subscribe((res) => {
        setTimeout(() => {
          alert('Mail sent successfully');
        }, 5000);
      });
  }

  showPopup = false;
  selecteditem: Parcel = { id: 0, shortcode: '', recipientName: '', status: '', description: '' };
  popupData: Otp = { parcelId: 0, otp: 0 };

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
    this.service.validateOtp(this.popupData).subscribe((res) => {
      alert('submitted successfully');
      this.getParcels();
    });
    this.closePopup();
  }
  reloadComponent() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url]);
    });
  }

  length: number = 0;
pageSize=5;
  onPageChange(event: PageEvent) {
    console.log(event.pageIndex);
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
};
type Otp = {
  parcelId: number;
  otp: number;
};
