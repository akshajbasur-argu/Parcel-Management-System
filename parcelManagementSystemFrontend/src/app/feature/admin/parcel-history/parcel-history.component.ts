import { Component } from '@angular/core';
import { AdminApiService } from '../../../core/service/admin-api.service';

@Component({
  selector: 'app-parcel-history',
  standalone: false,
  templateUrl: './parcel-history.component.html',
  styleUrl: './parcel-history.component.css'
})
export class ParcelHistoryComponent {
  constructor(private service: AdminApiService) { }
    
      ngOnInit(): any {
        this.service.fetchParcel().subscribe((res) => {
          this.parcels = res
        })
      }
      parcels: Array<Parcel> = []
  
  }
  type Parcel = {
    id: number,
    shortcode: string,
    recipientName: string,
    status: string,
    description: string
  }
  


