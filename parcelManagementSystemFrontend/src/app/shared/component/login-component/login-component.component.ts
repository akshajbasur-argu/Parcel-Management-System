import { Component } from '@angular/core';
import { AuthService } from '../../../core/service/auth-service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent {

  constructor(private authService: AuthService) {}

  onLoginWithGoogle(): void{

    this.authService.loginWithGoogle();
  }

}
