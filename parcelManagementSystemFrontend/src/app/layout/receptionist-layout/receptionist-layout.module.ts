import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReceptionistLayoutRoutingModule } from './receptionist-layout-routing.module';
import { ReceptionistLayoutComponent } from './receptionist-layout.component';
import { ReceptionistDashboardComponent } from '../../feature/receptionist/dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import {MatPaginatorModule} from '@angular/material/paginator';



@NgModule({
  declarations: [
    ReceptionistLayoutComponent,
    ReceptionistDashboardComponent,
  ],
  imports: [
    CommonModule,
    ReceptionistLayoutRoutingModule,
    SharedModule,
    MatPaginatorModule
  ]
})
export class ReceptionistLayoutModule { }
