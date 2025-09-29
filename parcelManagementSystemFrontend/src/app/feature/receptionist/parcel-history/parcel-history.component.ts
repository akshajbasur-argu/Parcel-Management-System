import { Component, ViewChild } from '@angular/core';
import { ReceptionistApiService } from '../../../core/service/receptionist-api.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-parcel-history',
  standalone: false,
  templateUrl: './parcel-history.component.html',
  styleUrl: './parcel-history.component.css',
})
export class ParcelHistoryComponent {

  constructor(private service: ReceptionistApiService) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  length: number = 0;
  num: number = 0;
  ngOnInit(): any {
    this.service.fetchParcelHistory(this.num).subscribe((res) => {
      console.log(res);
      this.parcels = res.content;
      this.length = res.totalElements;
      console.log('wbrivb', this.parcels);
    });
  }
  onPageChange(event: PageEvent) {
    this.service.fetchParcelHistory(event.pageIndex).subscribe((res) => {
      console.log('Page event');
      console.log(res);
      this.parcels = res.content;
      this.length = res.totalElements;
      console.log('wbrivb', this.parcels);
    });
  }

  parcels: Array<Parcel> = [
    //   { id: 1, shortcode: 'Random', recipientName: 'Akshaj', status: 'Received' },
    // { id: 2, shortcode: 'Random', recipientName: 'Vishwa', status: 'Received' },
    // { id: 3, shortcode: 'Random', recipientName: 'Tanishka', status: 'Received' },
    // { id: 4, shortcode: 'Random', recipientName: 'Arun', status: 'Received' }
  ];
}
type Parcel = {
  id: number;
  shortcode: string;
  recipientName: string;
  status: string;
  description: string;
};
