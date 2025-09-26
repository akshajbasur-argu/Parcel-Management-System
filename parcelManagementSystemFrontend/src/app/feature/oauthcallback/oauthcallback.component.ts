import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-oauthcallback',
  standalone: false,
  templateUrl: './oauthcallback.component.html',
  styleUrl: './oauthcallback.component.css'
})
export class OauthcallbackComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }


  ngOnInit(): void {
    this.http.get('http://localhost:8081/api/auth/me', { withCredentials: true }).subscribe({
      next: (response: any) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.router.navigate([`/${response.role.toLowerCase()}`]);
        console.log('Login successful:', response);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }

}
