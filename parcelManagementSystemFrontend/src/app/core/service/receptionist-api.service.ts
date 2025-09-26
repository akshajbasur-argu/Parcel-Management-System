import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReceptionistApiService {
  constructor(private httpClient:HttpClient){}

  url:string="http://localhost:8081/api/v1/receptionist"
  fetchUsers():Observable<any>{
    console.log("inside")
    return this.httpClient.get(this.url+'/users')
  }
  fetchParcel():Observable<any>{
    console.log("inside")
    return this.httpClient.get(this.url+'/parcels')
  }

  submitForm(form:any):Observable<any>{
    return this.httpClient.post(this.url+'/create/parcel',form);
  }

  resend(id:number):Observable<any>{
    return this.httpClient.get(this.url+`/resend/${id}`)
  }

  sendNotification(id:number):Observable<any>{
    return this.httpClient.get(this.url+`/notify/${id}`)
  }

  validateOtp(data:any):Observable<any>{
    return this.httpClient.post(this.url+'/validate',data)
  }
}
