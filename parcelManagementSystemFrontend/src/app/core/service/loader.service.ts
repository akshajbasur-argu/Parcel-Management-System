import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  showLoader() {
    
    setTimeout(() => this.isLoadingSubject.next(true), 0);  // ✅ Safe
  }
  hideLoader() {
    this.isLoadingSubject.next(false);
  }
  getValue(){
    return this.isLoading$.subscribe(value=>value)
  }
}
