import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/Services/product.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  retriveCartDataSubscribe!:Subscription;


  allDataProduct:any;
  Base_url:any;
  selectedProduct: any;


  constructor(
    private productService:ProductService,
  ) { 
    this.Base_url = environment.baseUrl
  }

  ngOnInit(): void {
    

    this.getAllProduct();
    
  }

  ngOnDestroy(): void {
    if(this.retriveCartDataSubscribe){
      this.retriveCartDataSubscribe.unsubscribe();
    }
  
  }


  getAllProduct(){
    this.retriveCartDataSubscribe =  this.productService.getProducts().subscribe(data=>{
      this.allDataProduct = data
      console.log(data)
    })
  }

  openModal(product: any) {
    this.selectedProduct = product;
  }


}
