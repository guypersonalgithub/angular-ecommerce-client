import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/UserService';
import { CartService } from '../../services/CartService';
import { CartOpen } from '../../models/CartOpen';

@Component({
  selector: 'app-statisticspanel',
  templateUrl: './statisticspanel.component.html',
  styleUrls: ['./statisticspanel.component.css']
})
export class StatisticspanelComponent implements OnInit {

  private userService: UserService;
  public cartService: CartService;
  public numberOfProducts;
  public numberOfOrders;

  currentUserCart;
  numberOfProductsOBS;
  numberOfOrdersOBS;

  constructor( userService: UserService, cartService: CartService) {
    this.userService = userService;
    this.cartService = cartService;
    this.currentUserCart = new CartOpen;
   }

  ngOnDestroy() {

    if (this.numberOfProductsOBS) {

      this.numberOfProductsOBS.unsubscribe();

    }

    if (this.numberOfOrdersOBS) {

      this.numberOfOrdersOBS.unsubscribe();

    }

  }

  ngOnInit() { // Gets the required statistics from the server alongside an observable to a behavior subject on the service in order to check what should be mentioned in terms of cart state.
    
    this.numberOfProductsOBS = this.userService.numberOfProductsOBS.subscribe(val => {

      if (val != -1) {

        this.numberOfProducts = val;

      }

    });

    this.numberOfOrdersOBS = this.userService.numberOfOrdersOBS.subscribe(val => {

      if (val != -1) {

        this.numberOfOrders = val;

      }

    });

  }

}
