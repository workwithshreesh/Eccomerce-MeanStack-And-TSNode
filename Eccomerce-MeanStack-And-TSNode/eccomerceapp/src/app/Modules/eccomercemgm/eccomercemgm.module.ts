import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EccomercemgmRoutingModule } from './eccomercemgm-routing.module';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';


@NgModule({
  declarations: [ProductComponent, CartComponent],
  imports: [
    CommonModule,
    EccomercemgmRoutingModule
  ]
})
export class EccomercemgmModule { }
