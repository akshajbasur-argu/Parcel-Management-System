// online-indicator.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { OnlineStatusService } from '../../core/service/online-status.service';
import { OfflineQueueService } from '../../core/service/offline-queue.service';

@Component({
  selector: 'app-online-indicator',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  template: `
    <div class="indicator" [class.online]="isOnline" [class.offline]="!isOnline" (click)="showDetails()">
      <span class="dot" aria-hidden="true"></span>
      <span class="text">{{ isOnline ? 'Online' : 'Offline' }}</span>
      <span *ngIf="queuedCount$ | async as q" class="badge" [class.hidden]="q === 0"> {{ q }} </span>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .indicator{
      display:inline-flex;
      align-items:center;
      gap:0.5rem;
      padding:6px 10px;
      border-radius:999px;
      font-weight:600;
      font-size:0.9rem;
      cursor:default;
      user-select:none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .indicator.online { background: #e8f9f0; color: #046c3a; }
    .indicator.offline { background: #fff5f5; color: #8b1e1e; }
    .dot{
      width:10px; height:10px; border-radius:50%;
      box-shadow: 0 0 6px rgba(0,0,0,0.06);
      display:inline-block;
    }
    .indicator.online .dot { background: #00c853; }
    .indicator.offline .dot { background: #ff1744; }
    .text { line-height:1; }
    .badge {
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-width:20px;
      height:20px;
      padding:0 6px;
      border-radius:10px;
      background: rgba(0,0,0,0.08);
      font-size:0.75rem;
      margin-left:4px;
    }
    .badge.hidden { display:none; }
  `]
})
export class OnlineIndicatorComponent implements OnInit {
  private onlineService = inject(OnlineStatusService);
  // MatSnackBar is optional: only used if Material present
  private snackBar = inject(MatSnackBar, { optional: true });

  // OfflineQueueService is optional (component will work without it)
  private offlineQueue = inject(OfflineQueueService, { optional: true });

  isOnline = navigator.onLine;
  queuedCount$ = this.offlineQueue ? (this.offlineQueue.getAll().then(items => items.length), of(0)) : of(0);

  ngOnInit(): void {
    // subscribe to online changes
    this.onlineService.online$.subscribe((val) => {
      const previous = this.isOnline;
      this.isOnline = val;

      // show a brief snackbar when status changes (if MatSnackBar is available)
      if (this.snackBar && previous !== val) {
        const msg = val ? 'Back online — syncing queued requests' : 'You are offline — actions will be queued';
        this.snackBar.open(msg, 'OK', { duration: 2500 });
      }

      // if we have OfflineQueueService, refresh queuedCount$ observable/future
      if (this.offlineQueue && val) {
        // when back online, refresh queuedCount$ once (so badge updates)
        // offlineQueue.getAll returns a Promise — we push into queuedCount$ by creating a new observable
        this.queuedCount$ = this.offlineQueue.getAll().then(items => items.length) as unknown as Observable<number>;
      } else if (this.offlineQueue) {
        // offline — show current queued length
        this.queuedCount$ = this.offlineQueue.getAll().then(items => items.length) as unknown as Observable<number>;
      }
    });
  }

  // show details on click: simple fallback alert if MatSnackBar missing
  async showDetails() {
    const q = this.offlineQueue ? await this.offlineQueue.getAll() : [];
    const queued = q ? q.length : 0;
    const txt = this.isOnline
      ? `Online now. ${queued} queued requests waiting.` 
      : `Offline — ${queued} request(s) queued and will be sent when you're back online.`;
    if (this.snackBar) this.snackBar.open(txt, 'OK', { duration: 3000 });
    else alert(txt);
  }
}
