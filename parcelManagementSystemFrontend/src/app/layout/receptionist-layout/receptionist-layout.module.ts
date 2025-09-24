import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceptionistLayoutRoutingModule } from './receptionist-layout-routing.module';
import { ReceptionistLayoutComponent } from './receptionist-layout.component';


@NgModule({
  declarations: [
    ReceptionistLayoutComponent
  ],
  imports: [
    CommonModule,
    ReceptionistLayoutRoutingModule
  ]
})
export class ReceptionistLayoutModule { }
