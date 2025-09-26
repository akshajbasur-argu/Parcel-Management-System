import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ParcelRequestComponent } from './feature/receptionist/parcel-request/parcel-request.component';
import { DashboardComponent } from './feature/receptionist/dashboard/dashboard.component';
import { LoginComponentComponent } from './shared/component/login-component/login-component.component';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { OauthcallbackComponent } from './feature/oauthcallback/oauthcallback.component';

@NgModule({
  declarations: [
    AppComponent,
    ParcelRequestComponent,
    DashboardComponent,
    OauthcallbackComponent, 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginComponentComponent,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
