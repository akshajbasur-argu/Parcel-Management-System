import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { DashboardComponent } from '../../feature/admin/dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    SharedModule
  ]
})
export class AdminLayoutModule { }
