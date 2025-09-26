import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ParcelRequestComponent } from './feature/receptionist/parcel-request/parcel-request.component';
import { FormsModule } from '@angular/forms';
import { LoginComponentComponent } from './shared/component/login-component/login-component.component';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { OauthcallbackComponent } from './feature/oauthcallback/oauthcallback.component';

import { UserListComponent } from './feature/receptionist/user-list/user-list.component';
import { ParcelListComponent } from './feature/receptionist/parcel-list/parcel-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ParcelHistoryComponent } from './feature/receptionist/parcel-history/parcel-history.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    AppComponent,
    ParcelRequestComponent,
    OauthcallbackComponent,
    ParcelRequestComponent,
    UserListComponent,
    ParcelListComponent,
    ParcelHistoryComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, RouterModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
