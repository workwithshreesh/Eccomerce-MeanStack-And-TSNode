import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './layouts/home/home.component';

const routes: Routes = [

  {
    path:"",
    component:HomeComponent
  },
  {
    path:"crud",
    loadChildren: () => import("./Modules/main-crud/main-crud.module").then(m => m.MainCrudModule)
  },
  {
    path:"eccom",
    loadChildren: () => import("./Modules/eccomercemgm/eccomercemgm.module").then(m => m.EccomercemgmModule)

  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
