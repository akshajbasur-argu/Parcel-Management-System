import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { LoginComponentComponent } from './component/login-component/login-component.component';
import { Sidebar } from './component/sidebar/sidebar';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [Sidebar, LoginComponentComponent],
  imports: [CommonModule, SharedRoutingModule, FormsModule, RouterModule],
  exports: [
    CommonModule,
    SharedRoutingModule,
    RouterModule,
    FormsModule,
    LoginComponentComponent,
    Sidebar,
  ],
})
export class SharedModule {}
