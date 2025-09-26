import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceptionistLayoutRoutingModule } from './receptionist-layout-routing.module';
import { ReceptionistLayoutComponent } from './receptionist-layout.component';
import { ReceptionistDashboardComponent } from '../../feature/receptionist/dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    ReceptionistLayoutComponent,
    ReceptionistDashboardComponent,
  ],
  imports: [
    CommonModule,
    ReceptionistLayoutRoutingModule,
    SharedModule
  ]
})
export class ReceptionistLayoutModule { }
