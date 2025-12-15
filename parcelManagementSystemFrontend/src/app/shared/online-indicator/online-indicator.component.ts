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
  templateUrl: './online-indicator.component.html',
  styles: [`:host {
  display: block;
}

/* Container = outer ring */
.indicator {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;


}

/* Inner dot */
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* States */
.indicator.online .dot {
  background-color: #22c55e; /* green */
}

.indicator.offline .dot {
  background-color: #9ca3af; /* gray */
}

/* Hide text & badge for avatar use */
.text,
.badge {
  display: none;
}

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
