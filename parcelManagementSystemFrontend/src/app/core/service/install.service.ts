// install.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>;
  readonly platforms?: string[];
};

@Injectable({
  providedIn: 'root',
})
export class InstallService {
  // whether browser supports 'beforeinstallprompt' and event captured
  private _canPrompt$ = new BehaviorSubject<boolean>(false);
  canPrompt$ = this._canPrompt$.asObservable();

  // store the event to call later
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  // track installed/dismissed so we can hide the button
  private _installed$ = new BehaviorSubject<boolean>(this.isInstalledFlagSet());
  installed$ = this._installed$.asObservable();

  constructor() {
    // Listen for the browser event
    window.addEventListener('beforeinstallprompt', (e: any) => {
      // Prevent the mini-infobar from showing on mobile
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this._canPrompt$.next(true);
      // optional: console log for debugging
      console.log('[InstallService] beforeinstallprompt captured');
    });

    // Fired when the app is installed
    window.addEventListener('appinstalled', () => {
      console.log('[InstallService] appinstalled event');
      this.markInstalled();
    });

    // If the browser has a different way of indicating installability, consider adding checks here
    // e.g., check window.matchMedia('(display-mode: standalone)') etc.
  }

  // whether we currently have a prompt available
  isPromptAvailable(): boolean {
    return !!this.deferredPrompt;
  }

  // call this when user clicks the button
  async promptInstall(): Promise<'accepted' | 'dismissed' | 'no-prompt'> {
    if (!this.deferredPrompt) {
      return 'no-prompt';
    }
    try {
      await this.deferredPrompt.prompt();
      const choice = await (this.deferredPrompt.userChoice ?? Promise.resolve({ outcome: 'dismissed' }));
      // If accepted -> mark installed after the appinstalled event or mark now
      if (choice.outcome === 'accepted') {
        this.markInstalled();
        this.deferredPrompt = null;
        this._canPrompt$.next(false);
        return 'accepted';
      } else {
        // user dismissed the prompt; optionally hide button for a while
        this.deferredPrompt = null;
        this._canPrompt$.next(false);
        return 'dismissed';
      }
    } catch (err) {
      console.error('[InstallService] prompt failed', err);
      return 'dismissed';
    }
  }

  // allow app to hide the button permanently (e.g. user clicked "Don't show")
  hidePermanently() {
    localStorage.setItem('pwa_install_hidden', '1');
    this._installed$.next(true);
  }

  // mark installed in storage and stream
  private markInstalled() {
    localStorage.setItem('pwa_installed', '1');
    this._installed$.next(true);
  }

  // Add this public getter
public isInstalled(): boolean {
  return this.isInstalledFlagSet();
}

  private isInstalledFlagSet(): boolean {
    return localStorage.getItem('pwa_installed') === '1' || localStorage.getItem('pwa_install_hidden') === '1';
  }

  // iOS heuristic: detect iOS Safari
  isIos(): boolean {
    const ua = window.navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  }

  // whether the page is already running in standalone (installed)
  isStandalone(): boolean {
    // Web app manifest standalone OR iOS standalone mode
    return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
  }
} 
