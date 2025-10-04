import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth-service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  token: string | undefined;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private toastrService: ToastrService,
    private authservice: AuthService
  ) {}
  isAccessTokenValid(): boolean {
    console.log(this.cookieService.get('accessToken'));
    if (!this.cookieService.get('accessToken')) {
      return false;
    }
    return true;
  }
  isRefreshTokenValid(): boolean {
    console.log("in refreshToken valid",this.cookieService.get('refreshToken'));
    if (!this.cookieService.get('refreshToken')) {
      console.log('regresh tokrn nhi hai ');
      this.toastrService.error('Session Expired, Please Login Again !!', 'Token Expired', {
        timeOut: 5000,
        toastClass: 'ngx-toastr custom-error-toast',
      });
      this.router.navigate(['login']);
      return false;
    }
    console.log('refresh token haiisliye true return kr ra hu');
    return true;
  }

  getRole(): string {
    this.token = this.cookieService.get('accessToken');
    const decoded = jwtDecode<jwtPayload>(this.token);
    return decoded.role;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    // console.log('inside can activacte');
    console.log("refresh token ",this.cookieService.get('refreshToken'));
    if (this.isAccessTokenValid()) {
      if (route.data['role'] === this.getRole()) {
        return true;
      }
      this.router.navigate(['login']);
      return false;
    }
     else if (this.isRefreshTokenValid()) {
      console.log('regresh tokrn hai ');
      this.authservice.refreshTokens().subscribe();
      return true;
    }

    return false;
  }
}
interface jwtPayload {
  role: string;
}
