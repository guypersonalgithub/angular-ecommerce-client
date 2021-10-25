import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';

import { HomeComponent } from '../components/home/home.component';
import { SignupComponent } from '../components/signup/signup.component';
import { LoginComponent } from '../components/login/login.component';
import { ShoppingComponent } from '../components/shopping/shopping.component';
import { OrderComponent } from '../components/order/order.component';
// import { AdminComponent } from '../components/admin/admin.component';

const routes: Routes = [
    { path: "home", component: HomeComponent},
    { path: "signup", component: SignupComponent},
    { path: "login", component: LoginComponent },
    { path: "shopping", component: ShoppingComponent },
    { path: "order", component: OrderComponent },
    // { path: "admin", component: AdminComponent},
    { path: "", redirectTo: "home", pathMatch: "full"},
]

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forRoot(routes)
    ]
})

export class RoutingModule {

}