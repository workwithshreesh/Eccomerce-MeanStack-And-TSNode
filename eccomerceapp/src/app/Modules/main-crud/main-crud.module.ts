import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainCrudRoutingModule } from './main-crud-routing.module';
import { CategoryMasterComponent } from './category-master/category-master.component';
import { ProductMasterComponent } from './product-master/product-master.component';


@NgModule({
  declarations: [CategoryMasterComponent, ProductMasterComponent],
  imports: [
    CommonModule,
    MainCrudRoutingModule
  ]
})
export class MainCrudModule { }
