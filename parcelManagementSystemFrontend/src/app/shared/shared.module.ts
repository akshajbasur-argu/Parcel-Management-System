import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { LoginComponentComponent } from './component/login-component/login-component.component';
import { Sidebar } from './component/sidebar/sidebar';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Loader } from './component/loader/loader';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [Sidebar, LoginComponentComponent, Loader],
  imports: [CommonModule,
    SharedRoutingModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ],
  exports: [
    CommonModule,
    SharedRoutingModule,
    RouterModule,
    FormsModule,
    LoginComponentComponent,
    Sidebar,
    Loader,
     MatIconModule,
    MatTooltipModule,
    MatButtonModule 

  ],
})
export class SharedModule { }
