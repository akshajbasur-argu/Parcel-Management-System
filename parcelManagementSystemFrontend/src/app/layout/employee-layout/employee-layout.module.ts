import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EmployeeLayoutRoutingModule } from './employee-layout-routing.module';
import { EmployeeLayoutComponent } from './employee-layout.component';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from '../../feature/employee/dashboard/dashboard.component';
import { ParcelHistoryComponent } from '../../feature/employee/parcel-history/parcel-history.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EmployeeLayoutComponent,
    DashboardComponent,
    ParcelHistoryComponent,
    
    
  ],
  imports: [
    CommonModule,
    EmployeeLayoutRoutingModule,
    SharedModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    CommonModule,
    DatePipe,
    MatPaginator,
    
  ]
})
export class EmployeeLayoutModule { }
