import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeApiService {
  constructor(private httpClient: HttpClient) { }

  url: string = "http://localhost:8081/api/v1/employee"

  fetchParcel(): Observable<any> {
    console.log("inside")
    return this.httpClient.get(this.url + '/parcels', { withCredentials: true })
  }
    public submitStatus(status:string,sender:number, id:number):Observable<any>{
    return this.httpClient.post(this.url+'/notification',{status,sender,id},{withCredentials:true});
  }
  public getNotifications():Observable<any>{
    console.log("called emp service");

    return this.httpClient.get(this.url+'/get/notifications',{withCredentials:true})
  }
  public getUserId():Observable<any>{
    return this.httpClient.get(this.url+'/get/id',{withCredentials:true});
  }

  updateParcelStatus(updatedParcels:{id: number, status: string}[] ): Observable<any> {
  return this.httpClient.post(this.url+'/updateParcel',updatedParcels,{ withCredentials: true });
  }
}
