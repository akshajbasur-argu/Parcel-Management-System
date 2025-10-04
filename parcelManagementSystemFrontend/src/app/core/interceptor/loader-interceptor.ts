import { Route, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { LoaderService } from '../service/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService, private router:Router) {
    console.log('hellooooooo 0000');
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('hellooooooo ');
    this.loaderService.showLoader();
    return next
      .handle(request)
      .pipe(finalize(() => this.loaderService.hideLoader()))
      .pipe(catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.status) {
            switch (error.status) {
              case 401:errorMessage = `Error: ${error.status} - You are not authorized.`;this.router.navigate(['/login']);
                break;
              case 404:errorMessage = `Error: ${error.status} - The requested resource was not found.`;this.router.navigate(['/not-found']);
                break;
              case 500: errorMessage = `Error: ${error.status} - An internal server error occurred.`;
                break;
              default:
                errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                break;
            }
          } else {
            errorMessage = `Client-side error: ${error.message}`;
          }
          console.error(errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
