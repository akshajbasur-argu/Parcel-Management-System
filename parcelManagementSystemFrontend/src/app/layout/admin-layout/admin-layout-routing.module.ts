import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../feature/admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout.component';
import { RoleComponent } from '../../feature/admin/role/role.component';
import { ParcelHistoryComponent } from '../../feature/admin/parcel-history/parcel-history.component';

const routes: Routes = [{
  path: '',
  component: DashboardComponent,
  children: [
    { path: "", component: RoleComponent },
    { path: "roles", component: RoleComponent },
    { path: "parcels", component: ParcelHistoryComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
