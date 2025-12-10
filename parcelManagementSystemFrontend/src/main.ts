import { provideZoneChangeDetection } from "@angular/core";
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
(window as any).global = window;
platformBrowser().bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection({ eventCoalescing: true })], })
  .catch(err => console.error(err));
