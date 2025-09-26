import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeLayoutRoutingModule } from './employee-layout-routing.module';
import { EmployeeLayoutComponent } from './employee-layout.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    EmployeeLayoutComponent
  ],
  imports: [
    CommonModule,
    EmployeeLayoutRoutingModule,
    SharedModule
  ]
})
export class EmployeeLayoutModule { }
