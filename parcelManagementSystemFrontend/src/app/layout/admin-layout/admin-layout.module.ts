import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { DashboardComponent } from '../../feature/admin/dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, NgModel } from '@angular/forms';
import { RoleComponent } from '../../feature/admin/role/role.component';
import { ParcelHistoryComponent } from '../../feature/admin/parcel-history/parcel-history.component';


@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    RoleComponent,
    ParcelHistoryComponent
  ],
  imports: [
    AdminLayoutRoutingModule,
    SharedModule,
    FormsModule,
    CommonModule
  ]
})
export class AdminLayoutModule { }
