import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
    constructor(private httpClient:HttpClient){}

  url:string="http://localhost:8081/api/v1/admin"
  fetchUsers():Observable<any>{
    return this.httpClient.get(this.url+'/users', { withCredentials: true })
  }

  updateUserRole(userId: number, role: string ): Observable<any> {
  return this.httpClient.put(`${this.url}/updateUser/${userId}`, role, { withCredentials: true });
}
  fetchParcel():Observable<any>{
    console.log("inside")
    return this.httpClient.get(this.url+'/parcels')
  }
}
