import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../feature/admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout.component';

const routes: Routes = [{
  path: '',
  component: AdminLayoutComponent,
  children: [
    { path: "", component:DashboardComponent },

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
