import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Sidebar } from './shared/component/sidebar/sidebar';
import { ParcelRequestComponent } from './feature/receptionist/parcel-request/parcel-request.component';
import { DashboardComponent } from './feature/receptionist/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    Sidebar,
    ParcelRequestComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
