import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Category } from '../models/Category';

@Injectable({
    providedIn: 'root'
})

export class CategoryService {

    private categories = new BehaviorSubject<Category[]>([]);
    public categoriesOBS = this.categories.asObservable();

    updateCategoriesArray (categories) {
        this.categories.next(categories);
    }
}