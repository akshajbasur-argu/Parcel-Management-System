import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../feature/employee/dashboard/dashboard.component';
import { ParcelHistoryComponent } from '../../feature/employee/parcel-history/parcel-history.component';
import { AuthGuard } from '../../core/auth/auth-guard';

const routes: Routes = [{
  path: '',
    component: DashboardComponent,
    children: [
      { path: "", component: ParcelHistoryComponent , canActivate:[AuthGuard],data:{role: 'EMPLOYEE'},},
      { path: "parcels", component: ParcelHistoryComponent , canActivate:[AuthGuard],data:{role: 'EMPLOYEE'},}

    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeLayoutRoutingModule { }
