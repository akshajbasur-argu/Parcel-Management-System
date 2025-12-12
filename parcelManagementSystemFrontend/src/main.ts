import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
(window as any).global = window;
platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));