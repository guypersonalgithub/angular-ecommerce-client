import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from '../models/Product';
import { SuccessfulProductResponse } from '../models/SuccessfulProductResponse';
import { UpdateProduct } from '../models/UpdateProduct';
import { NewProduct } from '../models/NewProduct';

@Injectable({
    providedIn: 'root'
})

export class ProductService {

    private products = new BehaviorSubject<Product[]>([]);
    public productsOBS = this.products.asObservable();

    constructor(private http: HttpClient) {

    }

    public updateProductsArray(products) {
        this.products.next(products);
    }
}