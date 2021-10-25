import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { MyCart } from '../models/MyCart';
import { CartOpen } from '../models/CartOpen';
import { SuccessfulProductResponse } from '../models/SuccessfulProductResponse';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})

export class CartService {

    private cartState = new BehaviorSubject<CartOpen>({creation_date: "" ,order_date: ""});    
    public cartStateOBS = this.cartState.asObservable();
    private cartItems = new BehaviorSubject<MyCart[]>([]);
    public cartItemsOBS = this.cartItems.asObservable();
    private totalPrice = new BehaviorSubject<number>(0);
    public totalPriceOBS = this.totalPrice.asObservable();
    private disableButton = new BehaviorSubject<boolean[]>([]);
    public disableButtonOBS = this.disableButton.asObservable();

    constructor(private http: HttpClient, private router: Router) {
    }

    public openNewCart(): any { // Opens a new cart.
        return this.http.post(environment.url + "/api/carts/opennewcart", null)
    }

    public createNewCart() {

        const observable = this.openNewCart();
        observable.subscribe(successfulCartCreationResponse => {

            // console.log(successfulCartCreationResponse);

            this.updatePrice(0);

            if (successfulCartCreationResponse.creation_date) {

                let fixCreationDateFormat = successfulCartCreationResponse.creation_date.indexOf('T');
                successfulCartCreationResponse.creation_date = successfulCartCreationResponse.creation_date.substring(0, fixCreationDateFormat);
        
              }
        
              if (successfulCartCreationResponse.order_date) {
        
                let fixOrderDateFormat = successfulCartCreationResponse.order_date.indexOf('T');
                successfulCartCreationResponse.order_date = successfulCartCreationResponse.order_date.substring(0, fixOrderDateFormat);
        
              }

              this.updateCartState({creation_date: successfulCartCreationResponse.creation_date, order_date: successfulCartCreationResponse.order_date});
              this.updateCartItems([]);

              if (location.pathname != "/shopping"){
                this.router.navigate(["/shopping"]);
              }

        }, serverErrorResponse => {

            alert ("It seems like the Heroku VM instance was sleeping, please login again and try doing your desired action once again.");
            if (location.pathname != "/login") {

                this.router.navigate(["/home"]);

            }
            localStorage.removeItem("token");

        });

    }

    public calculatePrice() { // Calculates the current total price and updates the total price observable.

        let price = 0;
        for (let i = 0; i < this.cartItems.value.length; i++){
            price = price + this.cartItems.value[i].price;
        }

        this.updatePrice(price);
    }


    public updateServerWithUpdatedProductInCart(updatedProductDetails: MyCart): Observable<SuccessfulProductResponse> { // Updates the server when a user changes the amount of picked product in his cart.
        return this.http.patch<SuccessfulProductResponse>(environment.url + "/api/carts/updateproductincart", updatedProductDetails);
    }

    public updateProductPrice(id, product_name, amount, price) { // Sends the details to the server, alongside calculating the new total price.

        let updatedProductDetails = {
            product_name : product_name,
            amount : amount,
            price : price,
        }

        const observable = this.updateServerWithUpdatedProductInCart(updatedProductDetails);
        observable.subscribe(succesfullLoginServerResponse => {
            for (let i = 0; i < this.cartItems.value.length; i++ ) {
                if (id == i) {
                    this.cartItems.value[i].amount = amount;
                    this.cartItems.value[i].price = price;
                }
            }
            this.calculatePrice();
        }, serverErrorResponse => { 

            alert ("It seems like the Heroku VM instance was sleeping, please login again and try doing your desired action once again.");
            this.router.navigate(["/home"]);
            localStorage.removeItem("token");
            
           });
    }

    public addNewProduct(product) { // Adds a new product to the cart and the server.
        const observable =  this.updateCartWithNewProduct(product);
        observable.subscribe(succesfullLoginServerResponse => {
            let newArray = this.cartItems.value;
            newArray.push(product);
            this.updateCartItems(newArray);
            // this.updateCartProducts(newArray);
            this.calculatePrice();
        }, serverErrorResponse => { 

            alert ("It seems like the Heroku VM instance was sleeping, please login again and try doing your desired action once again.");
            this.router.navigate(["/home"]);
            localStorage.removeItem("token");

           });
    }

    public updateCartWithNewProduct(product : MyCart): Observable<SuccessfulProductResponse> {
        return this.http.post<SuccessfulProductResponse>(environment.url + "/api/carts/addnewproducttocart", product);
    }

    public emptyCart() { // Empties the cart, alongside deletes all cart items in the specific cart in the server.
        const observable =  this.clearCartCompletely();
        observable.subscribe(succesfullLoginServerResponse => {
            let newArray = this.cartItems.value;
            newArray.splice(0, newArray.length);
            this.updateCartItems(newArray);
            // this.cartItems.value.splice(0, this.cartItems.value.length);
            this.calculatePrice();
        }, serverErrorResponse => { 

            alert ("It seems like the Heroku VM instance was sleeping, please login again and try doing your desired action once again.");
            this.router.navigate(["/home"]);
            localStorage.removeItem("token");

           });
    }

    public removeProductFromCart(product_id, product_name) { // Removes a specific product from the cart.
        const observable =  this.removeProductFromCartDB(product_name);
        observable.subscribe(succesfullLoginServerResponse => {
            
            let newCartItems = this.cartItems.value;
            newCartItems.splice(product_id, 1);
            this.updateCartItems(newCartItems);
            this.calculatePrice();

        }, serverErrorResponse => { 

            alert ("It seems like the Heroku VM instance was sleeping, please login again and try doing your desired action once again.");
            this.router.navigate(["/home"]);
            localStorage.removeItem("token");

           });
    }

    public removeProductFromCartDB(product : string): Observable<SuccessfulProductResponse> {
        return this.http.delete<SuccessfulProductResponse>(environment.url + "/api/carts/removeproductfromcart/" + product);
    }

    public clearCartCompletely(): Observable<SuccessfulProductResponse> {
        return this.http.delete<SuccessfulProductResponse>(environment.url + "/api/carts/clearcart");
    }

    updatePrice(price) {

        this.totalPrice.next(price);
    }

    updateCartItems(cart) {

        this.cartItems.next(cart);

    }

    updateCartState(cart) {

        this.cartState.next(cart);

    }

    updateDisableArray(array) {
        this.disableButton.next(array);
    }

}