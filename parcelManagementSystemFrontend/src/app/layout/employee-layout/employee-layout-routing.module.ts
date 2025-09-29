import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../feature/employee/dashboard/dashboard.component';
import { ParcelHistoryComponent } from '../../feature/employee/parcel-history/parcel-history.component';

const routes: Routes = [{
  path: '',
    component: DashboardComponent,
    children: [
      { path: "", component: ParcelHistoryComponent }
      // { path: "roles", component: RoleComponent },
      // { path: "parcels", component: ParcelHistoryComponent }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeLayoutRoutingModule { }
