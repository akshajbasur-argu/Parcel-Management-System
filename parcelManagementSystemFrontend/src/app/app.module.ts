import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, NgModel } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OauthcallbackComponent } from './feature/oauthcallback/oauthcallback.component';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LoaderInterceptor } from './core/interceptor/loader-interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    OauthcallbackComponent,
    

  ],

  imports: [BrowserModule,CommonModule,
    AppRoutingModule,
    FormsModule, HttpClientModule,
    RouterModule,CommonModule,MatPaginatorModule,
    ToastrModule.forRoot(),BrowserAnimationsModule,
    

  ],
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
