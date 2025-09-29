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
}
