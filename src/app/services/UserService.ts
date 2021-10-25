import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuccesfullLoginServerResponse } from '../models/SuccesfullLoginServerResponse';
import { UserLoginDetails } from '../models/UserLoginDetails';
import { UserSignUpDetails } from '../models/UserSignUpDetails';
import { SuccesfulSignUpServerResponse } from '../models/SuccesfulSignUpServerResponse';
import { UserDetails } from '../models/UserDetails';
import { BehaviorSubject } from 'rxjs';
import { GetIDs } from '../models/GetIDs';
import { ProductService } from './ProductService';
import { CategoryService } from './CategoryService';
import { CartService } from './CartService';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})

export class UserService {

    private productService: ProductService;
    private categoryService: CategoryService;
    private cartService: CartService;

    private userDetails = new BehaviorSubject<UserDetails>(new UserDetails());
    public userDetailsOBS = this.userDetails.asObservable();

    private numberOfProducts = new BehaviorSubject<Number>(-1);
    public numberOfProductsOBS = this.numberOfProducts.asObservable();

    private numberOfOrders = new BehaviorSubject<Number>(-1);
    public numberOfOrdersOBS = this.numberOfOrders.asObservable();

    constructor(productService: ProductService, categoryService: CategoryService, cartService: CartService, private http: HttpClient, private router: Router) {

        this.productService = productService;
        this.categoryService = categoryService;
        this.cartService = cartService;

    }

    public login(UserLoginDetails: UserLoginDetails): Observable<SuccesfullLoginServerResponse> { // login function

        return this.http.post<SuccesfullLoginServerResponse>(environment.url + "/api/users/login", UserLoginDetails);
    }

    public signUp(UserSignUpDetails: UserSignUpDetails): Observable<SuccesfulSignUpServerResponse> { // sign up function
        return this.http.post<SuccesfulSignUpServerResponse>(environment.url + "/api/users/signup", UserSignUpDetails);
    }

    public userDetailsCache(): any { // Gets all user details and stores them in a client sided cache.
        return this.http.get(environment.url + "/api/users/getuserdetails");
    }

    public checkIfUserIsLoggedIn() {

        if (localStorage.getItem("token")) {

            if (this.userDetails.value.first_name == null) {

                const observable = this.userDetailsCache();
                observable.subscribe(SuccesfullLoginServerResponse => {

                    let userDetails = {

                        id_number: SuccesfullLoginServerResponse.id_number,
                        city: SuccesfullLoginServerResponse.city,
                        street: SuccesfullLoginServerResponse.street,
                        first_name: SuccesfullLoginServerResponse.first_name,
                        last_name: SuccesfullLoginServerResponse.last_name,
                        role: SuccesfullLoginServerResponse.role,

                    };

                    this.updateUserDetails(userDetails);
                    this.updateNumberOfProducts(SuccesfullLoginServerResponse.products.length);
                    this.updateNumberOfOrders(SuccesfullLoginServerResponse.orderStats);
                    this.productService.updateProductsArray(SuccesfullLoginServerResponse.products);
                    this.categoryService.updateCategoriesArray(SuccesfullLoginServerResponse.categories);

                    if (SuccesfullLoginServerResponse.cart.creation_date) {

                        let fixCreationDateFormat = SuccesfullLoginServerResponse.cart.creation_date.indexOf('T');
                        SuccesfullLoginServerResponse.cart.creation_date = SuccesfullLoginServerResponse.cart.creation_date.substring(0, fixCreationDateFormat);
                
                      }
                
                      if (SuccesfullLoginServerResponse.cart.order_date) {
                
                        let fixOrderDateFormat = SuccesfullLoginServerResponse.cart.order_date.indexOf('T');
                        SuccesfullLoginServerResponse.cart.order_date = SuccesfullLoginServerResponse.cart.order_date.substring(0, fixOrderDateFormat);
                
                      }

                    this.cartService.updateCartState({creation_date: SuccesfullLoginServerResponse.cart.creation_date, order_date: SuccesfullLoginServerResponse.cart.order_date});
                    this.cartService.updateCartItems(SuccesfullLoginServerResponse.cart.cart_items);
                    this.cartService.calculatePrice();

                }, serverErrorResponse => {

                    alert ("It seems like the Heroku VM instance was sleeping, please login again before continuing.");
                    this.updateUserDetails(new UserDetails(-1, "", "", "", "", ""));
                    this.updateNumberOfProducts(-1);
                    this.updateNumberOfOrders(-1);
                    this.cartService.updateCartState({creation_date: null, order_date: null});
                    this.cartService.updateCartItems([]);
                    this.cartService.updatePrice(0);
                    localStorage.removeItem("token");

                    if (location.pathname != "/home"){

                        this.router.navigate(["/login"]);

                    }

                });

            }

        }

        else {

            this.updateUserDetails(new UserDetails(-1, "", "", "", "", ""));

            if (location.pathname != "/home"){

                this.router.navigate(["/login"]);

            }

        }

    }

    public getIDs(): Observable<GetIDs[]> {
        return this.http.get<GetIDs[]>(environment.url + "/api/users/allids");
    }

    updateUserDetails(user) {

        this.userDetails.next(user);
    }

    updateNumberOfProducts(number) {


        this.numberOfProducts.next(number);

    }

    updateNumberOfOrders(number) {

        this.numberOfOrders.next(number);

    }

}

