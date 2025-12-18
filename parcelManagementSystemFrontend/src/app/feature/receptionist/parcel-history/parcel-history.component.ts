import { Component, OnInit } from '@angular/core';
import { ReceptionistApiService } from '../../../core/service/receptionist-api.service';
import { SidebarService } from '../../../shared/services/sidebar';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-parcel-history',
  standalone: false,
  templateUrl: './parcel-history.component.html',
  styleUrl: './parcel-history.component.css',
})
export class ParcelHistoryComponent implements OnInit {

  constructor(
    private service: ReceptionistApiService,
    public sidebarService: SidebarService
  ) {}

  // Pagination
  num = 0;
  length = 0;
  pageSize = 10;

  // Data
  parcels: Parcel[] = [];
  searchTerm = '';

  // Debounced search
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadParcels();

    this.searchSubject
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.num = 0;
        this.loadParcels();
      });
  }

  // 🔹 Load parcel history (pagination + search)
  loadParcels(): void {
    this.service.fetchParcelHistory(this.num, this.searchTerm).subscribe({
      next: (res) => {
        this.parcels = res.content;
        this.length = res.page.totalElements;
      },
      error: (err) => {
        console.error('Error fetching parcel history:', err);
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
    this.loadParcels();
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
