import { Component } from '@angular/core';
import { EmployeeApiService } from '../../../core/service/employee-api.service';

@Component({
  selector: 'app-parcel-history',
  standalone: false,
  templateUrl: './parcel-history.component.html',
  styleUrl: './parcel-history.component.css'
})
export class ParcelHistoryComponent {

   constructor(private service: EmployeeApiService) { }
    
      ngOnInit(): any {
        this.service.fetchParcel().subscribe((res) => {
          this.parcels = res
          console.log(this.parcels)
        })
      }
      parcels: Array<Parcel> = [
        //   { id: 1, shortcode: 'Random', recipientName: 'Akshaj', status: 'Received' },
        // { id: 2, shortcode: 'Random', recipientName: 'Vishwa', status: 'Received' },
        // { id: 3, shortcode: 'Random', recipientName: 'Tanishka', status: 'Received' },
        // { id: 4, shortcode: 'Random', recipientName: 'Arun', status: 'Received' }
      ]
  
  }
  type Parcel = {
    id: number,
    shortcode: string,
    recipientName: string,
    status: string,
    description: string
  }

