import { Component } from '@angular/core';
import { ReceptionistApiService } from '../../../core/service/receptionist-api.service';
import { Router, RouteReuseStrategy } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-parcel-list',
  standalone: false,
  templateUrl: './parcel-list.component.html',
  styleUrl: './parcel-list.component.css'
})
export class ParcelListComponent {
  constructor(private service: ReceptionistApiService, private router:Router) { }

  ngOnInit(): any {
    this.service.fetchParcel().subscribe((res) => {
      this.parcels = res
    })
  }
  parcels: Array<Parcel> = [
    //   { id: 1, shortcode: 'Random', recipientName: 'Akshaj', status: 'Received' },
    // { id: 2, shortcode: 'Random', recipientName: 'Vishwa', status: 'Received' },
    // { id: 3, shortcode: 'Random', recipientName: 'Tanishka', status: 'Received' },
    // { id: 4, shortcode: 'Random', recipientName: 'Arun', status: 'Received' }
  ]
  validate(parcel:Parcel) {
    this.openPopup(parcel)

  }

  loading : number | null = null;

  resend(id: number) {
    this.loading = id
    this.service.resend(id).pipe(

      finalize(() => {
        this.loading = null;
      })
    ).subscribe((res) => 
      {
        
       setTimeout(()=>{
 alert("Mail sent successfully") 
       },5000)



      } 
    
    
    )

    

  }

  showPopup=false;
  selecteditem:Parcel={id:0,shortcode:'',recipientName:'',status:'',description:''};
  popupData:Otp={parcelId:0,otp:0};

  openPopup(parcel:Parcel){
    this.selecteditem=parcel;
    this.showPopup=true;
  }

  closePopup(){
    this.showPopup=false;
    this.popupData={parcelId:0,otp:0};
  }

  submitPopup(id:number){
    this.popupData.parcelId=id
    this.service.validateOtp(this.popupData).subscribe((res)=>{
      alert("submitted successfully");
      this.reloadComponent()
    })
    this.closePopup()
  }
reloadComponent() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url]);
    });
  }
}
type Parcel = {
  id: number,
  shortcode: string,
  recipientName: string,
  status: string,
  description: string
}
type Otp={
  parcelId:number,
  otp:number
}
