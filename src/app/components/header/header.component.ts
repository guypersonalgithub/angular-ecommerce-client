import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/CartService';
import { CartOpen } from '../../models/CartOpen';
import { UserService } from '../../services/UserService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private cartService : CartService;
  private userService : UserService;
  currentUserCart;

  userDetailsOBS;
  public loggedIn = false;

  public phoneMenu = "phoneMenuHidden";
  public menuShader = "shaderHidden";

  constructor(cartService: CartService, userService: UserService, private router: Router) { 
    this.cartService = cartService;
    this.userService = userService;
    this.currentUserCart = new CartOpen;
  }

  public home() { // Marks the home button on the header component.
    this.router.navigate(["/home"]);
  }

  public shopping() { // Creates/updates the cart according to its current state and moves the user to the shopping component.

    if (this.loggedIn) {

      this.router.navigate(["/shopping"]);

    }

    else {

      alert ("You must log in first before entering this section.");

    }

  }

  public order() { // Blocks the abiltiy to enter the order component by the UI assuming they haven't logged in, or they just ordered without opening a new cart.

    if (this.loggedIn) {

      this.router.navigate(["/order"]);

    }

    else {

      alert ("You must log in first before entering this section.");

    }

  }

  public openMenu() {

    this.phoneMenu = "phoneMenu";
    this.menuShader = "shader";

  }

  public closeMenu() {

    this.phoneMenu = "phoneMenuHidden";
    this.menuShader = "shaderHidden";

  }

  ngOnInit() {

    this.userDetailsOBS = this.userService.userDetailsOBS.subscribe(val => {

      if (val.first_name) {

        this.loggedIn = true;

      }

      else if (val.first_name == "") {

        this.loggedIn = false;

      }

    });

  }

  ngOnDestroy() {

    if (this.userDetailsOBS) {

      this.userDetailsOBS.unsubscribe();

    }

  }

}
