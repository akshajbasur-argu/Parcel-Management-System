import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../feature/employee/dashboard/dashboard.component';
import { ParcelHistoryComponent } from '../../feature/employee/parcel-history/parcel-history.component';
import { AuthGuard } from '../../core/auth/auth-guard';
import { CameraUpload } from '../../shared/ImageProcessing/camera-upload/camera-upload';

const routes: Routes = [{
  path: '',
    component: DashboardComponent,
    children: [
      { path: "", component: ParcelHistoryComponent , canActivate:[AuthGuard],data:{role: 'EMPLOYEE'},},
      { path: "parcels", component: ParcelHistoryComponent , canActivate:[AuthGuard],data:{role: 'EMPLOYEE'}},
    // { path: "parcels/invoice", component: CameraUpload, canActivate:[AuthGuard],data:{role: 'RECEPTIONIST'} },

    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeLayoutRoutingModule { }
