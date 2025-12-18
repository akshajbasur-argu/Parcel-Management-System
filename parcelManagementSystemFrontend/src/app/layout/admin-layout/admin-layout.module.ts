import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { DashboardComponent } from '../../feature/admin/dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, NgModel } from '@angular/forms';
import { RoleComponent } from '../../feature/admin/role/role.component';
import { ParcelHistoryComponent } from '../../feature/admin/parcel-history/parcel-history.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';


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
    CommonModule,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
   MatLabel,MatInput,
   MatIcon,
   MatIconModule,
   MatPaginator
  ]
})
export class AdminLayoutModule { }
