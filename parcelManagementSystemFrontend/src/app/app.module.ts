import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ParcelRequestComponent } from './feature/receptionist/parcel-request/parcel-request.component';
import { FormsModule, NgModel } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { OauthcallbackComponent } from './feature/oauthcallback/oauthcallback.component';

import { UserListComponent } from './feature/receptionist/user-list/user-list.component';
import { ParcelListComponent } from './feature/receptionist/parcel-list/parcel-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ParcelHistoryComponent } from './feature/receptionist/parcel-history/parcel-history.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, RouterModule,CommonModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
