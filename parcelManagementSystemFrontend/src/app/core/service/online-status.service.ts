// online-status.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent, merge, of, Subscription } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OnlineStatusService implements OnDestroy {
  // BehaviorSubject so components can read current value immediately
  private _online$ = new BehaviorSubject<boolean>(navigator.onLine);
  get online$(): Observable<boolean> { return this._online$.asObservable(); }
  get snapshot(): boolean { return this._online$.value; }

  private subs: Subscription[] = [];

  constructor() {
    // React to browser events
    const online$ = fromEvent(window, 'online').pipe(mapTo(true));
    const offline$ = fromEvent(window, 'offline').pipe(mapTo(false));
    // startWith ensures initial emission
    const merged$ = merge(online$, offline$).pipe(startWith(navigator.onLine));

    const s = merged$.subscribe((isOnline) => {
      // update BehaviorSubject
      this._online$.next(isOnline);
    });
    this.subs.push(s);
  }

  isOnline(): boolean {
    return this._online$.value;
  }

  // Optional manual trigger (useful for testing)
  setOnlineState(state: boolean) {
    this._online$.next(state);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
