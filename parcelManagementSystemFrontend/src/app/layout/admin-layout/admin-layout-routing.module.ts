import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../feature/admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout.component';
import { RoleComponent } from '../../feature/admin/role/role.component';
import { ParcelHistoryComponent } from '../../feature/admin/parcel-history/parcel-history.component';
import { AuthGuard } from '../../core/auth/auth-guard';

const routes: Routes = [{
  path: '',
  component: DashboardComponent,
  children: [
    { path: "", component: RoleComponent , canActivate:[AuthGuard],data:{role: 'ADMIN'},},
    { path: "roles", component: RoleComponent , canActivate:[AuthGuard],data:{role: 'ADMIN'},},
    { path: "parcels", component: ParcelHistoryComponent, canActivate:[AuthGuard],data:{role: 'ADMIN'}, }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
