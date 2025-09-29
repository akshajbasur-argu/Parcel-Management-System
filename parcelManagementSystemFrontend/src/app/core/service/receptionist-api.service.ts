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
    return this.httpClient.get(this.url+'/users',{withCredentials:true})
  }
  fetchActiveParcel(num:number):Observable<any>{
    console.log("inside")
    return this.httpClient.get(this.url+`/parcels/${num}`,{withCredentials:true})
  }

  fetchParcelHistory(num:number):Observable<any>{
    return this.httpClient.get(this.url+`/parcels/history/${num}`,{withCredentials:true})
  }

  submitForm(form:any):Observable<any>{
    return this.httpClient.post(this.url+'/create/parcel',form,{withCredentials:true});
  }

  resend(id:number):Observable<any>{
    return this.httpClient.get(this.url+`/resend/${id}`,{withCredentials:true})
  }

  sendNotification(id:number):Observable<any>{
    return this.httpClient.get(this.url+`/notify/${id}`,{withCredentials:true})
  }

  validateOtp(data:any):Observable<any>{
    return this.httpClient.post(this.url+'/validate',data,{withCredentials:true})
  }
}
