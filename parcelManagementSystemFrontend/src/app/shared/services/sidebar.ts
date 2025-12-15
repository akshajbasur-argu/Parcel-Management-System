import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private collapsedSubject = new BehaviorSubject<boolean>(false);
  private isMobileSubject = new BehaviorSubject<boolean>(false);

  collapsed$: Observable<boolean> = this.collapsedSubject.asObservable();
  isMobile$: Observable<boolean> = this.isMobileSubject.asObservable();

  constructor() {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  private checkMobile() {
    const isMobile = window.innerWidth < 768;
    this.isMobileSubject.next(isMobile);
    
    // On mobile, start collapsed (icon strip)
    // On desktop, start expanded
    if (isMobile) {
      this.collapsedSubject.next(true);
    } else {
      this.collapsedSubject.next(false);
    }
  }

  toggleSidebar() {
    this.collapsedSubject.next(!this.collapsedSubject.value);
  }

  get isCollapsed(): boolean {
    return this.collapsedSubject.value;
  }

  get isMobile(): boolean {
    return this.isMobileSubject.value;
  }
}