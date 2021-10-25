import { Component, OnInit } from '@angular/core';
import { OrderDetails } from '../../models/OrderDetails';
import { OrderService } from '../../services/OrderService';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/UserService';
import { UserDetails } from '../../models/UserDetails';
import { BusyShippingDates } from '../../models/BusyShippingDates';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import { MyCart } from '../../models/MyCart';
import { CartService } from '../../services/CartService';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Receipt } from 'src/app/models/Receipt';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  private orderService : OrderService;
  public orderDetails: OrderDetails;
  model: NgbDateStruct;
  date: {year: number, month: number};
  private userService : UserService;
  userDetails;
  currentYear;
  currentMonth;
  currentDay;
  public busyShippingDates: BusyShippingDates[] = [{year: 0, month: 0, day: 0}];
  isDisabled;
  public disabledCode: string = "";
  public myCart: MyCart[];
  private cartService : CartService;

  public receiptText : Receipt[];

  public text: string;

  currentUserCart;

  userDetailsOBS;
  cartOBS;
  amountOfOrdersOBS;
  cartDateOBS;

  public openingDate;

  public numberOfOrders;

  smallScreen;
  receiptStateButtonText = "Open";
  cartClass = true;

  fileUrl;

  public finishedOrder = false;

  constructor( orderService: OrderService, userService : UserService, cartService : CartService, private calendar: NgbCalendar, private modalService: NgbModal, private router: Router, private sanitizer: DomSanitizer) { 
    this.orderDetails = new OrderDetails();
    this.orderService = orderService;
    this.userService = userService;
    this.userDetails = new UserDetails;
    this.cartService = cartService;
    this.resizedScreen = this.resizedScreen.bind(this);
  }

  public order(content): void { // Sends an order request to the server.

    if (this.myCart.length == 0) {
      alert ("Cannot finish an order with no products");
    }

    else if (this.finishedOrder) {

      alert ("You have already ordered the items in this cart. If you would like to order once again, please open a new cart. (You can open a new cart by either pressing on the 'Open a new cart' button in the home page, or entering the shopping page after you complete your current order).");

    } 

    else {

      const observable = this.orderService.order(this.orderDetails);

      observable.subscribe(succesfulServerRequestData => {

        this.modalService.open(content);

        this.receiptText = succesfulServerRequestData;
        this.text = "";
        for (let i = 0; i < this.receiptText.length; i++) {
          if (i < this.receiptText.length - 1) {
            let helper = "Product name: " + this.receiptText[i].name + " amount : " + this.receiptText[i].amount + " price : " + this.receiptText[i].price + " \n";
            this.text = this.text.concat(helper);
          }
          else {
            let helper = "Total price: " + this.receiptText[i].price;
            this.text = this.text.concat(helper);
          }
        }

        const blob = new Blob([this.text], { type: 'application/octet-stream' });
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

        this.numberOfOrders = this.numberOfOrders + 1;

        this.userService.updateNumberOfOrders(this.numberOfOrders);
        
        let date = new Date();
        let currentDate = date.getFullYear() + "-" + "0" + (date.getMonth() + 1) + "-" + (date.getDate() -1);

        this.cartService.updateCartState({creation_date: this.openingDate, order_date: currentDate});

        this.finishedOrder = true;

      }, serverErrorResponse => {

        alert ("It seems like the Heroku VM instance was sleeping, please login again and try doing your desired action once again.");
        this.router.navigate(["/home"]);
        localStorage.removeItem("token");

      });

    }
  }

  public postCity() { // Posts the user's city on double click.
    this.orderDetails.city = this.userDetails.city;
  }

  public postStreet() { // Posts the user's street on double click.
    this.orderDetails.street = this.userDetails.street;
  }

  save() { // Closes modal.
    this.modalService.dismissAll();

  }

  backHome() {

    this.router.navigate(["/home"]);

  }

  public getReceipt(receipt) { // Opens a new modal with a request to get all cart details, in order to get a pop-up receipt.
  }

  openReceipt() {

    if (this.cartClass) {

      this.cartClass = false;
      this.receiptStateButtonText = "Open";

    }

    else {

      this.cartClass = true;
      this.receiptStateButtonText = "Close";

    }

  }

  resizedScreen() {

    if (window.innerWidth <= 1000 && !this.smallScreen) {

      this.smallScreen = true;
      this.cartClass = false;

    }

    else if (window.innerWidth > 1000 && this.smallScreen) {

      this.smallScreen = false;
      this.cartClass = false;

    }

  }

  ngOnDestroy() {
  
    if (this.userDetailsOBS) {

      this.userDetailsOBS.unsubscribe();

    }

    if (this.cartOBS) {

      this.cartOBS.unsubscribe();

    }

    if (this.amountOfOrdersOBS) {

      this.amountOfOrdersOBS.unsubscribe();

    }

    if (this.cartDateOBS) {

      this.cartDateOBS.unsubscribe();

    }

    window.removeEventListener('resize', this.resizedScreen, true);

  }

  ngOnInit(): void {

    this.userService.checkIfUserIsLoggedIn();

    window.addEventListener('resize', this.resizedScreen, true);

    if (window.innerWidth <= 1000) {

      this.smallScreen = true;
      this.cartClass = false;

    }

    else {

      this.smallScreen = false;
      this.cartClass = false;

    }

    this.userDetailsOBS = this.userService.userDetailsOBS.subscribe(val => {

      if (val.city) {

        this.userDetails = val

      }

    });

    this.cartOBS = this.cartService.cartItemsOBS.subscribe(val => {

      if (val.length > 0) {

        this.myCart = val;

      }

      else {

        this.myCart = [];

      }

    });

    this.amountOfOrdersOBS = this.userService.numberOfOrdersOBS.subscribe(val => {

      if (val >= 0) {
        
        this.numberOfOrders = val;

      }

    });

    this.cartDateOBS = this.cartService.cartStateOBS.subscribe(val => {

      if (val.creation_date) {

        this.openingDate = val.creation_date;

      }

      if (val.creation_date && val.order_date) {

        this.finishedOrder = true;

      }

    });

  }

}
