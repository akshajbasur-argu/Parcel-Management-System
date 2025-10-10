import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeLayoutRoutingModule } from './employee-layout-routing.module';
import { EmployeeLayoutComponent } from './employee-layout.component';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from '../../feature/employee/dashboard/dashboard.component';
import { ParcelHistoryComponent } from '../../feature/employee/parcel-history/parcel-history.component';


@NgModule({
  declarations: [
    EmployeeLayoutComponent,
    DashboardComponent,
    ParcelHistoryComponent
    
  ],
  imports: [
    CommonModule,
    EmployeeLayoutRoutingModule,
    SharedModule
  ]
})
export class EmployeeLayoutModule { }
