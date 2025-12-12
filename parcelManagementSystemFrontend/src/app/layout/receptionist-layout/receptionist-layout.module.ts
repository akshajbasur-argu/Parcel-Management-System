import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModel } from '@angular/forms';
import { ReceptionistLayoutRoutingModule } from './receptionist-layout-routing.module';
import { ReceptionistLayoutComponent } from './receptionist-layout.component';
import { ReceptionistDashboardComponent } from '../../feature/receptionist/dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ParcelRequestComponent } from '../../feature/receptionist/parcel-request/parcel-request.component';
import { ParcelListComponent } from '../../feature/receptionist/parcel-list/parcel-list.component';
import { FormsModule } from '@angular/forms';
import { ParcelHistoryComponent } from '../../feature/receptionist/parcel-history/parcel-history.component';
import { UserListComponent } from '../../feature/receptionist/user-list/user-list.component';
import { OnlineIndicatorComponent } from '../../shared/online-indicator/online-indicator.component';


@NgModule({
  declarations: [
    ReceptionistLayoutComponent,
    ReceptionistDashboardComponent,
    ParcelRequestComponent,
    ParcelListComponent,
    ParcelRequestComponent,
    ParcelHistoryComponent,
    UserListComponent
  ],
  imports: [
    ReceptionistLayoutRoutingModule,
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
    OnlineIndicatorComponent
  ],
})
export class ReceptionistLayoutModule {}
