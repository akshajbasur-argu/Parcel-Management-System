import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
    constructor(private httpClient:HttpClient){}

  url:string="https://sjkqbbn5-8081.inc1.devtunnels.ms/api/v1/admin"
  fetchUsers():Observable<any>{
    return this.httpClient.get(this.url+'/users', { withCredentials: true })
  }

  updateUserRole(updatedUsers:{id: number, role: string}[] ): Observable<any> {
  return this.httpClient.post(this.url+'/updateUser',updatedUsers,{ withCredentials: true });
}
  fetchParcel():Observable<any>{
    console.log("inside")
    return this.httpClient.get(this.url+'/parcels', { withCredentials: true })
  }

  updateParcelStatus(updatedParcels:{id: number, status: string}[] ): Observable<any> {
  return this.httpClient.post(this.url+'/updateParcel',updatedParcels,{ withCredentials: true });
  }
}
