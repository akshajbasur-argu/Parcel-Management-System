import { Subject } from 'rxjs';
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
    if (!this.cookieService.get('accessToken')) {
      return false;
    }
    return true;
  }
  isRefreshTokenValid(): boolean {
    //  
    return true;
  }

  getRole(): string {
    this.token = this.cookieService.get('accessToken');
    const decoded = jwtDecode<jwtPayload>(this.token);
    return decoded.role;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    // console.log('inside can activacte');
    // if (this.isAccessTokenValid()) {
    //   if(!route.data['role'])
    //     return true;
    //   if (route.data['role'] === this.getRole()) {
    //     return true;
    //   }
    //   this.router.navigate(['login']);
    //   return false;
    // }
    // else if (this.isRefreshTokenValid()) {
    //   this.authservice.refreshTokens().subscribe();
    //   return true;
    // }

    // return false;
    return true;
  }
}
interface jwtPayload {
  role: string;
  sub: string;
}
