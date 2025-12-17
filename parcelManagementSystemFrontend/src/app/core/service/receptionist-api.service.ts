// src/app/core/service/receptionist-api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { OfflineQueueService } from './offline-queue.service';

@Injectable({
  providedIn: 'root',
})
export class ReceptionistApiService {
  constructor(private httpClient: HttpClient, private offlineQueue: OfflineQueueService) {}

  url: string = 'https://sjkqbbn5-8081.inc1.devtunnels.ms/api/v1/receptionist';
  fetchUsers(): Observable<any> {
    return this.httpClient.get(this.url + '/users', { withCredentials: true });
  }
  fetchActiveParcel(num: number): Observable<any> {
    return this.httpClient.get(this.url + `/parcels/${num}`, { withCredentials: true });
  }

  fetchParcelHistory(num: number): Observable<any> {
    return this.httpClient.get(this.url + `/parcels/history/${num}`, { withCredentials: true });
  }

  /**
   * submitForm: accepts FormData or plain object.
   * When offline, convert to FormData and enqueue; returns an Observable that resolves after enqueue.
   */
 // receptionist-api.service.ts (submitForm)
submitForm(form: any): Observable<any> {
  const endpoint = this.url + '/create/parcel';

  // If form is FormData convert to plain object, otherwise assume plain object
  const toPlainObject = (input: any) => {
    if (input instanceof FormData) {
      // convert FormData -> object
      const obj: any = {};
      for (const [k, v] of Array.from((input as FormData).entries())) {
        obj[k] = (v instanceof File ) ? null : v; // files not supported in JSON path
      }
      return obj;
    }
    return input;
  };

  const payload = toPlainObject(form);

  if (!navigator.onLine) {
    // enqueue plain JSON object
    return from(this.offlineQueue.enqueue({
      url: endpoint,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    })).pipe(map(() => ({ offline: true, message: 'Request queued for sync when online' })));
  }

  // online -> send JSON
  return this.httpClient.post(endpoint, payload, { withCredentials: true });
}


  resend(id: number): Observable<any> {
    return this.httpClient.get(this.url + `/resend/${id}`, { withCredentials: true });
  }

  sendNotification(id: number, message: string): Observable<any> {
    return this.httpClient.post(this.url + `/notify`, { id, message }, { withCredentials: true });
  }

  validateOtp(data: any): Observable<any> {
    return this.httpClient.post(this.url + '/validate', data, { withCredentials: true });
  }
  getNotifications(): Observable<any> {
    return this.httpClient.get(this.url + '/get/notifications', { withCredentials: true });
  }
  getPaginatedUsers(page: number, size: number, search: string = '') {
  const params: any = { page, size };
  if (search.trim()) params.search = search;

  return this.httpClient.get<any>(this.url+'/list', {
    params,
    withCredentials: true
  });
}

  changeStatus(id: number): Observable<any> {
    return this.httpClient.post(this.url + '/change/status', id, { withCredentials: true });
  }
  postInvoiceExtract(form: FormData) :Observable<any> {
    const endpoint = 'https://sjkqbbn5-8081.inc1.devtunnels.ms/api/invoice/extract';
    if (!navigator.onLine) {
      return from(this.offlineQueue.enqueue({ url: endpoint, method: 'POST', body: form }))
             .pipe(map(() => ({ offline: true })));
    }
    return this.httpClient.post(endpoint, form, { withCredentials: true });
  }

  postInvoiceSendMail(names: string[], barcodeString: string):Observable<any>{
    const endpoint = `https://sjkqbbn5-8081.inc1.devtunnels.ms/api/invoice/sendMail?barcodeString=${encodeURIComponent(barcodeString)}`;
    if (!navigator.onLine) {
      // queue JSON POST
      return from(this.offlineQueue.enqueue({ url: endpoint, method: 'POST', body: names }))
             .pipe(map(() => ({ offline: true })));
    }
    return this.httpClient.post(endpoint, names, { responseType: 'text' as const, withCredentials: true });
  }

  postInvoiceExtractEmployee(form: FormData):Observable<any>{
    const endpoint = 'https://sjkqbbn5-8081.inc1.devtunnels.ms/api/invoice/extract/employee';
    if (!navigator.onLine) {
      return from(this.offlineQueue.enqueue({ url: endpoint, method: 'POST', body: form }))
             .pipe(map(() => ({ offline: true })));
    }
    return this.httpClient.post<boolean>(endpoint, form, { withCredentials: true });
  }
}
