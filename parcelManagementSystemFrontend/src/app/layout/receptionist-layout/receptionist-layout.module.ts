import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceptionistLayoutRoutingModule } from './receptionist-layout-routing.module';
import { ReceptionistLayoutComponent } from './receptionist-layout.component';
import { ReceptionistDashboardComponent } from '../../feature/receptionist/dashboard/dashboard.component';
import { Sidebar } from '../../shared/component/sidebar/sidebar';



@NgModule({
  declarations: [
    ReceptionistLayoutComponent,
    ReceptionistDashboardComponent,
    Sidebar
  ],
  imports: [
    CommonModule,
    ReceptionistLayoutRoutingModule,
  ]
})
export class ReceptionistLayoutModule { }
