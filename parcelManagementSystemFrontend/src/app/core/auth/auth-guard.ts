import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {jwtDecode} from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
token: string | undefined;

      constructor(private cookieService: CookieService, private router:Router) { }

      getRole(): string {
        // To get a cookie value
        this.token = this.cookieService.get('accessToken');
        const decoded = jwtDecode<jwtPayload>(this.token)
        return decoded.role
      }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        console.log("token role",this.getRole());
        console.log("saved role",route.data['role']);

      if(route.data['role']==this.getRole())
      {
        return true
      }
      this.router.navigate(['login'])
      return false
  }

}
interface jwtPayload{
  role:string
}
