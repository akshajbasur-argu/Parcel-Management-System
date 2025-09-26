import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: "admin",
    loadChildren: () => import('./layout/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
  },
  {
    path: "receptionist",
    loadChildren: () => import('./layout/receptionist-layout/receptionist-layout.module').then(m => m.ReceptionistLayoutModule)
  },
  {
    path:'',component:AppComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
