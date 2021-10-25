import {Component, NgModule, VERSION, Pipe, PipeTransform, OnInit} from '@angular/core'
import {BrowserModule, DomSanitizer} from '@angular/platform-browser'
import { CartService } from '../../services/CartService';
import { MyCart } from '../../models/MyCart';
import { observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProductService } from '../../services/ProductService';
import { Product } from 'src/app/models/Product';

@Pipe({ // Highlight filter
  name: 'highlight'
})
export class HighlightSearch implements PipeTransform {
constructor(private sanitizer: DomSanitizer){}

transform(value: any, args: any): any {
  if (!args) {
    return value;
  }
  // Match in a case insensitive maneer
  const re = new RegExp(args, 'gi');
  const match = value.match(re);

  // If there's no match, just return the original value.
  if (!match) {
    return value;
  }

  const replacedValue = value.replace(re, "<mark>" + match[0] + "</mark>")
  return this.sanitizer.bypassSecurityTrustHtml(replacedValue)
}
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {

  private cartService: CartService;
  private productService : ProductService;
  public myCart: MyCart[];
  public products: Product[];

  totalPrice;
  public currentPage = 0;

  public disableButton = [];

  cartItemsOBS;
  cartPriceOBS;
  disableButtonOBS;
  productsOBS;

  searchTerm: string;
  public receipts = [];

  constructor( cartService: CartService, productService : ProductService, private router: Router ) { 
    this.cartService = cartService;
    this.productService = productService;
  }

  public decreaseAmount(product_id, product_name) { // Decreases the amount of a chosen product on the cart. Will remove a product off the cart if the user decreases the amount down to 0.
    
    if (this.myCart[product_id].amount > 0) {

      let original_price = this.myCart[product_id].price / this.myCart[product_id].amount;
      let currentAmount = this.myCart[product_id].amount - 1;
      this.myCart[product_id].price = currentAmount * original_price;

      if(currentAmount == 0) {

        this.cartService.removeProductFromCart(product_id, this.myCart[product_id].product_name);
        this.myCart[product_id].amount = this.myCart[product_id].amount - 1;
        let index = this.findProductIndex(product_name);
        this.disableButton[index] = false;
        this.cartService.updateDisableArray(this.disableButton);

      }
      else {
        this.cartService.updateProductPrice(product_id, this.myCart[product_id].product_name, currentAmount, this.myCart[product_id].price);
        this.myCart[product_id].amount = this.myCart[product_id].amount - 1;

      }

    }
    
  }

  public increaseAmount(product_id) { // Increases the amount of a chosen product on the cart.
    let original_price = this.myCart[product_id].price / this.myCart[product_id].amount;
    this.myCart[product_id].amount++;
    this.myCart[product_id].price = this.myCart[product_id].amount * original_price;
    this.cartService.updateProductPrice(product_id, this.myCart[product_id].product_name, this.myCart[product_id].amount, this.myCart[product_id].price);
  }

  public removeProductFromCart(product_id, product_name) { // Removes a product from the cart.
    this.cartService.removeProductFromCart(product_id, this.myCart[product_id].product_name);
    let index = this.findProductIndex(product_name);
    this.disableButton[index] = false;
    this.cartService.updateDisableArray(this.disableButton);

  }

  public emptyCart() { // Empties the cart.
    this.cartService.emptyCart();
    for (let i = 0; i < this.disableButton.length; i++) {
      this.disableButton[i] = false;
    }
    this.cartService.updateDisableArray(this.disableButton);
  }

  public moveToOrderPage() { // Moves to the order page.
    this.router.navigate(["/order"]);
  }

  public moveBackToShop() { // Moves to the shopping page.
    this.router.navigate(["/shopping"]);
  }

  public findProductIndex(product_name) { // Finds to index of a product in the products array, in order to later on disable the add to cart button once the product is added to the cart.
    let index;
    for(let i = 0; i < this.products.length; i++) {
      if (this.products[i].product_name == product_name){
        index = i;
        break;
      }
    }
    return index;
  }

  updateSearch(e) { // Search for the highlight filter.
    this.searchTerm = e.target.value
  }

  ngOnDestroy() {

    if (this.cartItemsOBS) {

      this.cartItemsOBS.unsubscribe();

    }

    if (this.disableButtonOBS) {

      this.disableButtonOBS.unsubscribe();

    }

    if (this.productsOBS) {

      this.productsOBS.unsubscribe();

    }

    if (this.cartPriceOBS) {

      this.cartPriceOBS.unsubscribe();

    }

  }

  ngOnInit(): void {

    if (location.pathname == "/shopping"){
      this.currentPage = 1;
    }
    else {
      this.currentPage = 0;
    }

    this.productsOBS = this.productService.productsOBS.subscribe(val => {

      if (val.length > 0) {

        this.products = val;

      }

    });

    this.cartItemsOBS = this.cartService.cartItemsOBS.subscribe(val => {

      if (val.length > 0) {

        this.myCart = val;

        if (this.currentPage == 0) {

          let receipts = [];

          for (let i = 0; i < this.myCart.length; i++) {
  
            let receipt = { summary : "product : " + this.myCart[i].product_name + " , amount : " + this.myCart[i].amount + " , price : " + this.myCart[i].price};
            receipts.push(receipt);
         
          }
  
          this.receipts = receipts;

        }

      }

    });

    this.disableButtonOBS = this.cartService.disableButtonOBS.subscribe(val => {

      if (this.disableButton != val) {

        this.disableButton = val;

      }

    });

    this.cartPriceOBS = this.cartService.totalPriceOBS.subscribe(val => {

      this.totalPrice = val;

    });

  }

}
