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
// import { CameraUpload } from './ImageProcessing/camera-upload/camera-upload';
import { SelectNamesDialog } from './ImageProcessing/select-names-dialog/select-names-dialog';
import { DownloadAppButtonComponent } from './component/download-app-button/download-app-button.component';
import { OnlineIndicatorComponent } from './online-indicator/online-indicator.component';
@NgModule({
  declarations: [Sidebar, LoginComponentComponent, Loader,SelectNamesDialog, ],
  imports: [CommonModule,
    SharedRoutingModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    DownloadAppButtonComponent,
    OnlineIndicatorComponent
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
