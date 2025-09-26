import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceptionistLayoutComponent } from './receptionist-layout.component';
import { ReceptionistDashboardComponent } from '../../feature/receptionist/dashboard/dashboard.component';
import { ParcelListComponent } from '../../feature/receptionist/parcel-list/parcel-list.component';
import { UserListComponent } from '../../feature/receptionist/user-list/user-list.component';
import { ParcelRequestComponent } from '../../feature/receptionist/parcel-request/parcel-request.component';
import { ParcelHistoryComponent } from '../../feature/receptionist/parcel-history/parcel-history.component';

const routes: Routes = [{
  path: '',
  component: ReceptionistDashboardComponent,
  children: [
    { path: "", component: ParcelListComponent },
    { path: "users", component: UserListComponent },
    { path: "parcels", component: ParcelListComponent },
    { path: "parcels/create", component: ParcelRequestComponent },
    { path: "parcels/history", component: ParcelHistoryComponent },

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceptionistLayoutRoutingModule { }
