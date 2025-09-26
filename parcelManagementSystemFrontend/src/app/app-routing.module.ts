import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './shared/component/login-component/login-component.component';
import { ReceptionistLayoutComponent } from './layout/receptionist-layout/receptionist-layout.component';
import { EmployeeLayoutComponent } from './layout/employee-layout/employee-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { OauthcallbackComponent } from './feature/oauthcallback/oauthcallback.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponentComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
    ]
  },
  {
    path: 'receptionist',
    component: ReceptionistLayoutComponent,
    children: [
    ]
  },
  {
    path: 'employee',
    component: EmployeeLayoutComponent,
    children: [
    ]
  }, {
    path: 'oauth2/callback', component: OauthcallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
