import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/CategoryService';
import { Category } from '../../models/Category';
import { UserService } from '../../services/UserService';
import { ProductService } from '../../services/ProductService';
import { Product } from '../../models/Product';
import { CartService } from '../../services/CartService';
import { MyCart } from '../../models/MyCart';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../services/OrderService';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css'],
})
export class ShoppingComponent implements OnInit {

  private userService: UserService;
  private categoryService: CategoryService;
  public categories: Category[];
  private productService: ProductService;
  public products: Product[];
  public allProducts: Product[];
  amount: number[] = [];
  private cartService: CartService;
  public newCartProduct: MyCart;
  searchName: string;
  public disableButton = [];
  private orderService : OrderService;
  private currentUserCartOBS;
  currentUserCart;

  menuChangeStateButtonText;
  
  myCart : MyCart[];

  showCart = true;

  cartOBS;
  disableButtonOBS;
  productsOBS;
  categoriesOBS;
  cartStateOBS;
  userDetailsOBS;

  public isUserLoggedIn;

  public environment = environment;

  constructor ( userService: UserService, categoryService: CategoryService, productService: ProductService, cartService: CartService, orderService : OrderService, private modalService: NgbModal, private router: Router ) {
    this.userService = userService;
    this.categoryService = categoryService; 
    this.productService = productService;
    this.cartService = cartService;
    this.orderService = orderService;
    this.resizedScreen = this.resizedScreen.bind(this);
  }

  public pickCategory(category_name) { // Acts as a filter for sorting categories on click

    let filteredProducts = [];

    for (let i =0; i < this.allProducts.length; i++) {

      if (this.allProducts[i].category_name == category_name) {

        filteredProducts.push(this.allProducts[i]);

      }

    }

    this.products = filteredProducts;
    // this.currentShoppingPage = category_name;
    // this.filterButtonPressed = false;
  }

  public decreaseAmount(product_id) { // Decreases the amount picked.
    if (this.amount[product_id] > 0) {
      this.amount[product_id]--;
    }
  }

  public increaseAmount(product_id) { // Increases the amount picked.
    this.amount[product_id]++;
  }

  public nameFilter(name) { // Acts as a filter by name written.

    let filteredProduct = [];

    for (let i = 0; i < this.allProducts.length; i++) {

      if (this.allProducts[i].product_name == name) {

        filteredProduct.push(this.allProducts[i]);
        break;

      }

    }

    this.products = filteredProduct;

  }

  public resetFilter() { // Resets the filter.

    this.products = this.allProducts;

  }

  public addProductToCart(index, product_name, price, amount) { // Adds a product to the cart and updates the visuals.
    if (amount == 0) {
      alert ("The quantity must be atleast 1 in order to purchase the item.");
    }
    else {
      let finalPrice = price * amount;
      this.newCartProduct = {product_name : product_name, amount : amount, price : finalPrice}
      // this.cartService.cartCopy.push(this.newCartProduct);
      this.cartService.addNewProduct(this.newCartProduct);
      this.cartService.calculatePrice();
      this.disableButton[index] = true;
      this.cartService.updateDisableArray(this.disableButton);
    }
  }

  public hideCart() { // Hides or reveals the cart, depending on what had happened previously.

    if (this.showCart) {
      this.showCart = false;
    }
    else {
      this.showCart = true;
    }

    if (this.menuChangeStateButtonText == "Open") {

      this.menuChangeStateButtonText = "Close";

    }

    else if (this.menuChangeStateButtonText == "Close") {

      this.menuChangeStateButtonText = "Open";

    }
  }
  
  open(content) { // Opens the modal.
    this.modalService.open(content);
  }

  save(index, product_name, price, amount) { // Closes the modal, updates cart.
    this.addProductToCart(index, product_name, price, amount);
    this.amount[index] = 0;
    this.modalService.dismissAll();
  }

  resizedScreen() {

    if (window.innerWidth <= 1000 && !this.showCart && this.menuChangeStateButtonText == "Open") {

      this.menuChangeStateButtonText = "Close";

    }

    else if (window.innerWidth <= 1000 && this.showCart && this.menuChangeStateButtonText == "Close") {

      this.menuChangeStateButtonText = "Open";

    }

    else if (window.innerWidth > 1000 && !this.showCart && this.menuChangeStateButtonText == "Close") {

      this.menuChangeStateButtonText = "Open";

    }

    else if (window.innerWidth > 1000 && this.showCart && this.menuChangeStateButtonText == "Open") {

      this.menuChangeStateButtonText = "Close";

    }

  }

  ngOnDestroy() {    

    if (this.categoriesOBS) {

      this.categoriesOBS.unsubscribe();

    }

    if (this.productsOBS) {

      this.productsOBS.unsubscribe();

    }

    if (this.cartOBS) {

      this.cartOBS.unsubscribe();

    }

    if (this.disableButtonOBS) {

      this.disableButtonOBS.unsubscribe();

    }

    if (this.cartStateOBS) {

      this.cartStateOBS.unsubscribe();

    }

    if (this.userDetailsOBS) {

      this.userDetailsOBS.unsubscribe();

    }

    window.removeEventListener('resize', this.resizedScreen, true);

  }

  ngOnInit(): void {

    this.userService.checkIfUserIsLoggedIn();

    window.addEventListener('resize', this.resizedScreen, true)

    if (window.innerWidth <= 1000) {

      this.menuChangeStateButtonText = "Open";

    }

    else if (window.innerWidth > 1000) {

      this.menuChangeStateButtonText = "Close";

    }

    this.categoriesOBS = this.categoryService.categoriesOBS.subscribe(val => {

      if (val.length > 0) {

        this.categories = val;

      }    

    });

    this.productsOBS = this.productService.productsOBS.subscribe(val => {

      if (val.length > 0) {

        this.products = val;
        this.allProducts = val;
        this.amount = [];
        this.disableButton = [];
        for (let i = 0; i < this.allProducts.length; i++) {

          this.amount.push(0);
          this.disableButton.push(false);

        }

      }

    });

    this.cartOBS = this.cartService.cartItemsOBS.subscribe(val => {

      if (val.length > 0) {

        this.myCart = val;

        for (let i = 0; i < this.allProducts.length; i++) {
          for (let j = 0; j < this.myCart.length; j++) {
            if (this.myCart[j].product_name == this.products[i].product_name) {
              this.disableButton[i] = true;
            }
          }
        }

        this.cartService.updateDisableArray(this.disableButton);

      }

    });

    this.disableButtonOBS = this.cartService.disableButtonOBS.subscribe(val => {

      if (this.disableButton != val) {

        this.disableButton = val;

      }

    });

    this.userDetailsOBS = this.userService.userDetailsOBS.subscribe(val => {

      if (val.first_name) {

        this.isUserLoggedIn = true;

      }

    })

    this.cartStateOBS = this.cartService.cartStateOBS.subscribe(val => {

      if ((val.creation_date && val.order_date || !val.creation_date && !val.order_date) && this.isUserLoggedIn) {

        this.cartService.createNewCart();

      }

    });

  }

}
