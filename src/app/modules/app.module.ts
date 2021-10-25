import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RoutingModule } from './routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import {AuthenticationInterceptor } from '../interceptors/AuthenticationInterceptor';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LayoutComponent } from '../components/layout/layout.component';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { HomeComponent } from '../components/home/home.component';
import { CartComponent, HighlightSearch } from '../components/cart/cart.component';
import { SignupComponent } from '../components/signup/signup.component';
import { StatisticspanelComponent } from '../components/statisticspanel/statisticspanel.component';
import { LoginComponent } from '../components/login/login.component';
import { ShoppingComponent } from '../components/shopping/shopping.component';
import { OrderComponent } from '../components/order/order.component';
// import { AdminComponent } from '../components/admin/admin.component';


@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CartComponent,
    HighlightSearch,
    SignupComponent,
    StatisticspanelComponent,
    LoginComponent,
    ShoppingComponent,
    OrderComponent,
    // AdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    RoutingModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,

  ],
  providers: [ {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true}],
  bootstrap: [LayoutComponent]
})
export class AppModule { }
