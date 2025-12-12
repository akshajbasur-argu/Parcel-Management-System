// download-app-button.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { InstallService } from '../../../core/service/install.service';

@Component({
  selector: 'app-download-app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      *ngIf="(showButton$ | async)"
      class="download-btn"
      (click)="onClick($event)"
      aria-label="Install app"
      title="Install app"
    >
      <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.84v4h4.66V9h3.84L12 2z" fill="currentColor"></path>
      </svg>
      <span class="label">Install App</span>
    </button>

    <!-- iOS fallback: show a small info box if iOS detected -->
    <div *ngIf="(showIosFallback$ | async)" class="ios-fallback" (click)="showIosInstructions()">
      <small>iOS — tap Share → Add to Home Screen</small>
    </div>
  `,
  styles: [`
    :host { display:inline-block; }
    .download-btn {
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding:6px 10px;
      border-radius:8px;
      border:1px solid rgba(0,0,0,0.08);
      background:var(--pwa-btn-bg, #ffffff);
      color:var(--pwa-btn-color, #111827);
      font-weight:600;
      cursor:pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      transition:transform .06s ease;
    }
    .download-btn:active { transform: translateY(1px); }
    .icon { opacity:0.9; }
    .ios-fallback { font-size:0.78rem; color:#6b7280; padding:4px 6px; border-radius:6px; cursor:help; }
  `]
})
export class DownloadAppButtonComponent implements OnInit {
  private installService = inject(InstallService);

  // show button if we can prompt OR (for iOS show fallback)
  showButton$: Observable<boolean> = this.installService.canPrompt$.pipe();

  // iOS fallback: show when iOS detected and not standalone and not installed flag
  showIosFallback$ = new Observable<boolean>(subscriber => {
    const isIos = this.installService.isIos();
    const notStandalone = !this.installService.isStandalone();
    const notInstalled = !this.installService.isInstalled();
    subscriber.next(isIos && notStandalone && notInstalled);
    subscriber.complete();
  });

  ngOnInit(): void {
    // nothing else needed; canPrompt$ will change when service captures event
  }

  async onClick(e: Event) {
    e.preventDefault();
    // If native prompt available:
    if (this.installService.isPromptAvailable()) {
      const choice = await this.installService.promptInstall();
      if (choice === 'accepted') {
        // optionally show a toast or hide the button (service already marks installed)
        console.log('User accepted PWA install');
      } else if (choice === 'dismissed') {
        // optionally hide permanently or do nothing
        console.log('User dismissed PWA install prompt');
      } else {
        // no prompt available: handle fallback
        this.showIosInstructions();
      }
    } else {
      // fallback (iOS or browsers that don't support)
      this.showIosInstructions();
    }
  }

  showIosInstructions() {
    // Simple instructions dialog — you can replace this with a real modal/snackbar
    alert('To install the app on iOS: tap the Share button in Safari (the square + arrow) and choose "Add to Home Screen".');
  }
}
