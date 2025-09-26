import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userRole: string | null = null;
  constructor(private http: HttpClient) { }

  public loginWithGoogle() {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';

}
}
