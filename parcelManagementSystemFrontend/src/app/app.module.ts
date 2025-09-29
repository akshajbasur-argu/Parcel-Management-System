import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ParcelRequestComponent } from './feature/receptionist/parcel-request/parcel-request.component';
import { FormsModule, NgModel } from '@angular/forms';
import { LoginComponentComponent } from './shared/component/login-component/login-component.component';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OauthcallbackComponent } from './feature/oauthcallback/oauthcallback.component';

import { UserListComponent } from './feature/receptionist/user-list/user-list.component';
import { ParcelListComponent } from './feature/receptionist/parcel-list/parcel-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ParcelHistoryComponent } from './feature/receptionist/parcel-history/parcel-history.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Loader } from './shared/component/loader/loader';
import { LoaderInterceptor } from './core/interceptor/loader-interceptor';

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

  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, RouterModule,CommonModule,MatPaginatorModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    CookieService,
    provideHttpClient(withInterceptorsFromDi()),
    {
          provide: HTTP_INTERCEPTORS,
          useClass: LoaderInterceptor,
          multi: true
        }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
