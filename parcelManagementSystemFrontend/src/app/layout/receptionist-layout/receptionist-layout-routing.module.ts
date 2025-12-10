import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceptionistLayoutComponent } from './receptionist-layout.component';
import { ReceptionistDashboardComponent } from '../../feature/receptionist/dashboard/dashboard.component';
import { ParcelListComponent } from '../../feature/receptionist/parcel-list/parcel-list.component';
import { UserListComponent } from '../../feature/receptionist/user-list/user-list.component';
import { ParcelRequestComponent } from '../../feature/receptionist/parcel-request/parcel-request.component';
import { ParcelHistoryComponent } from '../../feature/receptionist/parcel-history/parcel-history.component';
import { AuthGuard } from '../../core/auth/auth-guard';
import { CameraUpload } from '../../shared/ImageProcessing/camera-upload/camera-upload';

const routes: Routes = [{
  path: '',
  component: ReceptionistDashboardComponent,
  children: [
    { path: "", component: ParcelListComponent, canActivate:[AuthGuard],data:{role: 'RECEPTIONIST'},},
    { path: "users", component: UserListComponent, canActivate:[AuthGuard],data:{role: 'RECEPTIONIST'} },
    { path: "parcels", component: ParcelListComponent, canActivate:[AuthGuard],data:{role: 'RECEPTIONIST'} },
    { path: "parcels/create", component: ParcelRequestComponent, canActivate:[AuthGuard],data:{role: 'RECEPTIONIST'} },
    { path: "parcels/history", component: ParcelHistoryComponent, canActivate:[AuthGuard],data:{role: 'RECEPTIONIST'} },
    // { path: "parcels/invoice", component: CameraUpload, canActivate:[AuthGuard],data:{role: 'RECEPTIONIST'} },


  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceptionistLayoutRoutingModule { }
