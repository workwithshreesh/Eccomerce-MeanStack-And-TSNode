import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  routerEvent!:Subscription
  isCart:boolean = false;

  constructor(private router:Router){}

  ngOnInit(): void {
    // this.routerEvent = this.router.events.subscribe(()=>{
    //   this.isCart = this.router.url === "/cart"
    // });
  }


  // ngOnDestroy(): void {
  //   if(this.routerEvent){
  //     this.routerEvent.unsubscribe()
  //   }
  // }

}
