import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SuccesfulOrder } from '../models/SuccessfulOrder';
import { OrderDetails } from '../models/OrderDetails';
import { BusyShippingDates } from '../models/BusyShippingDates';
import { Receipt } from '../models/Receipt';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})

export class OrderService {

    private busyShipping = new BehaviorSubject<BusyShippingDates[]>([{year: 0, month: 0, day: 0}]);
    public busyShippingOBS = this.busyShipping.asObservable();

    constructor(private http: HttpClient) {

    }

    public order(OrderDetails: OrderDetails): Observable<Receipt[]> { // Sends order to the server.
        return this.http.patch<Receipt[]>(environment.url + "/api/orders/ordernow", OrderDetails)
    }

    updateShippingDates(dates) {
        this.busyShipping.next(dates);
    }

}