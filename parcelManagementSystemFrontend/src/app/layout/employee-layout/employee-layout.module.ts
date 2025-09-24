import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeLayoutRoutingModule } from './employee-layout-routing.module';
import { EmployeeLayoutComponent } from './employee-layout.component';


@NgModule({
  declarations: [
    EmployeeLayoutComponent
  ],
  imports: [
    CommonModule,
    EmployeeLayoutRoutingModule
  ]
})
export class EmployeeLayoutModule { }
