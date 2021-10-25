import { Component, OnInit } from '@angular/core';
import { UserLoginDetails } from '../../models/UserLoginDetails';
import { UserService } from '../../services/UserService';
import { ProductService } from '../../services/ProductService';
import { CategoryService } from '../../services/CategoryService';
import { CartService } from '../../services/CartService';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public userLoginDetails: UserLoginDetails;
  private usersService: UserService;
  private productService: ProductService;
  private categoryService: CategoryService;
  private cartService: CartService;
  public isUserLoggedIn;
  public currentCartState = "";
  public openingDate;
  public orderingDate;
  name: string;
  userDetailsOBS;
  currentCartOBS;

  constructor(usersService: UserService, productService: ProductService, categoryService: CategoryService, cartService: CartService, private router: Router) { 
    this.userLoginDetails = new UserLoginDetails();
    this.usersService = usersService;
    this.productService = productService;
    this.categoryService = categoryService;
    this.cartService = cartService;

  }

  public login(): void { // login function. Upon login the function saves the users' details in a client-like cache, checks and updates the current user's cart if they have one, and puts them in the proper place according to their user role.
    const observable = this.usersService.login(this.userLoginDetails);

    observable.subscribe(succesfulServerRequestData => {

      let userDetails = {

        username_email: succesfulServerRequestData.username_email,
        id_number: succesfulServerRequestData.id_number,
        city: succesfulServerRequestData.city,
        street: succesfulServerRequestData.street,
        first_name: succesfulServerRequestData.first_name,
        last_name: succesfulServerRequestData.last_name,
        role: succesfulServerRequestData.role

      }

      this.usersService.updateUserDetails(userDetails);
      localStorage.setItem("token", succesfulServerRequestData.token +"");

      this.usersService.updateNumberOfOrders(succesfulServerRequestData.orderStats);
      this.usersService.updateNumberOfProducts(succesfulServerRequestData.products.length);
      this.categoryService.updateCategoriesArray(succesfulServerRequestData.categories);
      this.productService.updateProductsArray(succesfulServerRequestData.products);

      if (succesfulServerRequestData.cart.creation_date) {

        let fixCreationDateFormat = succesfulServerRequestData.cart.creation_date.indexOf('T');
        succesfulServerRequestData.cart.creation_date = succesfulServerRequestData.cart.creation_date.substring(0, fixCreationDateFormat);

      }

      if (succesfulServerRequestData.cart.order_date) {

        let fixOrderDateFormat = succesfulServerRequestData.cart.order_date.indexOf('T');
        succesfulServerRequestData.cart.order_date = succesfulServerRequestData.cart.order_date.substring(0, fixOrderDateFormat);

      }

      this.cartService.updateCartState({creation_date: succesfulServerRequestData.cart.creation_date, order_date: succesfulServerRequestData.cart.order_date});
      this.cartService.updateCartItems(succesfulServerRequestData.cart.cart_items);
      this.cartService.calculatePrice();

      this.isUserLoggedIn = true;

      this.router.navigate(["/home"]);

    }, serverErrorResponse => { 
      alert ("Failed to login. Please try again with different details.");
    });
  }

  public signUp(): void { // Moves to the sign up component
    this.router.navigate(["/signup"]);
  }

  public startShopping(): void { // Creates a new cart if there is no available one, and moves the user to the shopping component.

    if (this.currentCartState == "new" || this.currentCartState == "new user") {

      this.cartService.createNewCart();

    }
    
  }

  public resumeShopping(): void { // Picks an available cart and moves the user to the shopping component.

    this.router.navigate(["/shopping"]);
  }

  ngOnDestroy() {

    if (this.userDetailsOBS) {

      this.userDetailsOBS.unsubscribe();

    }

    if (this.currentCartOBS) {

      this.currentCartOBS.unsubscribe();

    }

  }

  ngOnInit() {

    this.usersService.checkIfUserIsLoggedIn();

    this.userDetailsOBS = this.usersService.userDetailsOBS.subscribe(val => {

      if (val.first_name != "" && val.first_name) {

        this.isUserLoggedIn = true;

        this.name = val.first_name;

      }

      else if (val.first_name == "") {

        this.isUserLoggedIn = false;

      }

    });

    this.currentCartOBS = this.cartService.cartStateOBS.subscribe(val => {

      if (val.creation_date && !val.order_date) {

        this.currentCartState = "continued";
        this.openingDate = val.creation_date;

      }
      
      else if (val.creation_date && val.order_date) {

        this.currentCartState = "new";
        this.orderingDate = val.order_date;

      }

      else if (!val.creation_date && !val.order_date) {

        this.currentCartState = "new user";

      }

    });

  }

}
