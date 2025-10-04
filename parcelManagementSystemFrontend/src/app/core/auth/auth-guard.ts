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
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  token: string | undefined;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  isTokenValid(): boolean {
    if (!this.cookieService.get('accessToken')) {
      this.toastrService.error('Session Expired, Please Login Again !!', 'Token Expired', {
        timeOut: 5000,
        toastClass: 'ngx-toastr custom-error-toast',
      });
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  getRole(): string {
    this.token = this.cookieService.get('accessToken');
    const decoded = jwtDecode<jwtPayload>(this.token);
    return decoded.role;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (this.isTokenValid()) {
      if (route.data['role'] === this.getRole()) {
        return true;
      }
      this.router.navigate(['login']);
      return false;
    }
    return false;
  }
}
interface jwtPayload {
  role: string;
}
