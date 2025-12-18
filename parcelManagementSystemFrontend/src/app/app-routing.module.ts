import { AuthGuard } from './core/auth/auth-guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './shared/component/login-component/login-component.component';
import { ReceptionistLayoutComponent } from './layout/receptionist-layout/receptionist-layout.component';
import { EmployeeLayoutComponent } from './layout/employee-layout/employee-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { OauthcallbackComponent } from './feature/oauthcallback/oauthcallback.component';
import { CameraUpload } from './shared/ImageProcessing/camera-upload/camera-upload';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponentComponent },
  {
    path: 'oauth2/callback',
    component: OauthcallbackComponent,
  },
  {
    path: 'employee',
    loadChildren: () =>
      import('./layout/employee-layout/employee-layout.module').then((m) => m.EmployeeLayoutModule), canActivate:[AuthGuard],data:{role: 'EMPLOYEE'},
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./layout/admin-layout/admin-layout.module').then((m) => m.AdminLayoutModule),canActivate:[AuthGuard],data:{role: 'ADMIN'}
  },
  {
    path: 'receptionist',
    loadChildren: () =>
      import('./layout/receptionist-layout/receptionist-layout.module').then(
        (m) => m.ReceptionistLayoutModule
      ),canActivate:[AuthGuard],data:{role: 'RECEPTIONIST'}
  },
  {
  path: 'invoice',
  loadComponent: () =>
    import('./shared/ImageProcessing/camera-upload/camera-upload')
      .then(m => m.CameraUpload),canActivate:[AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
