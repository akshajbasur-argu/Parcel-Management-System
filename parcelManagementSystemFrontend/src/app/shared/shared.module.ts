import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { LoginComponentComponent } from './component/login-component/login-component.component';
import { Sidebar } from './component/sidebar/sidebar';

@NgModule({
  declarations: [
    Sidebar
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports:[
    SharedRoutingModule
    SharedRoutingModule,
    LoginComponentComponent
  ],exports: [
    LoginComponentComponent,
    Sidebar
  ]
})
export class SharedModule { }
