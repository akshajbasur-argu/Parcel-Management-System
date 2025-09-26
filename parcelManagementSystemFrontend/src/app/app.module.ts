import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Sidebar } from './shared/component/sidebar/sidebar';
import { ParcelRequestComponent } from './feature/receptionist/parcel-request/parcel-request.component';
import { FormsModule } from '@angular/forms';

import { UserListComponent } from './feature/receptionist/user-list/user-list.component';
import { ParcelListComponent } from './feature/receptionist/parcel-list/parcel-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ParcelHistoryComponent } from './feature/receptionist/parcel-history/parcel-history.component';
@NgModule({
  declarations: [
    AppComponent,
    ParcelRequestComponent,
    ParcelRequestComponent,
    UserListComponent,
    ParcelListComponent,
    ParcelHistoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  exports:[],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
