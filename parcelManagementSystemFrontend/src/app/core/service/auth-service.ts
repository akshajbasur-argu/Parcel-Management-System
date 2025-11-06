import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole: string | null = null;
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  public loginWithGoogle() {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  }

  public refreshTokens(): Observable<any> {
    return this.http.get('http://localhost:8081/api/auth/refresh', { withCredentials: true });
  }
  public userDetails(): Observable<any> {
    return this.http.get('http://localhost:8081/api/auth/user/details', { withCredentials: true });
  }
  public logout() {
    // console.log(this.cookieService.get('refreshToken'))
    // // console.log(this.cookieService.set('refreshToken',''));

    // this.cookieService.set('refreshToken','nullllllll')
    // console.log(this.cookieService.get('refreshToken'))
    // this.cookieService.deleteAll()
    this.cookieService.delete('refreshToken', '/', 'localhost');
    this.cookieService.delete('accessToken', '/', 'localhost');
    // this.cookieService.delete('refreshToken','/','localhost:8081')
    this.router.navigate(['login']);
    console.log('end');
  }
}
