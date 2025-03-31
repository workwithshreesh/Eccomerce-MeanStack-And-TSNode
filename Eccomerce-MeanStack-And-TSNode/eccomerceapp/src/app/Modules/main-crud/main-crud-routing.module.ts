import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryMasterComponent } from './category-master/category-master.component';
import { ProductMasterComponent } from './product-master/product-master.component';

const routes: Routes = [
  {
    path:"category",
    component:CategoryMasterComponent
  },
  {
    path:"product",
    component:ProductMasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainCrudRoutingModule { }
