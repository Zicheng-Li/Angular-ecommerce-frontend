import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Routes, RouterModule, Router } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';


import { PaginatorModule } from 'primeng/paginator';
// Angular language service angular.io/guide/language-service
// ng-bootstrap
// special angular syntax for two-way data binding [()]
// [] this is one way data binding
// () this is one way data binding, for event binding, when user click page change, it will 
// Angular validation, validators.email and pattern only check the format, do not check if the email is real
// replaySubject is a subclass of subject, it will record the previous subject before the subsrcibe
// behaviourSubject is a subclass of subject, it have a notion "current value", it will send the latest message/event to new subscriber
// OAuth2, JSON Web Token, JWT, JWT is a standard for authentication
// Open ID Connect
// OktaAuthGuard
// web storage api, HTML5: store the data use storage.setItem(key, value), retrieve data using storage.getItem(key)

import{
  OktaAuthModule,
  OktaCallbackComponent,
  OKTA_CONFIG,
  OktaAuthGuard
} from '@okta/okta-angular';

import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
const oktaConfig =  myAppConfig.oidc;

const oktaAuth = new OktaAuth(oktaConfig);

function sendToLogin(oktaAuth: OktaAuth, injector: Injector) {
  // use injector to access any services within the application
  const router = injector.get(Router);
  router.navigate(['/login']);
} 

const routes : Routes = [
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard],
                data: {onAuthRequired: sendToLogin}},
  {path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard],
                data: {onAuthRequired: sendToLogin}},
  {path: 'login/callback', component: OktaCallbackComponent},  // okta package module, user will redirect
  {path: 'login', component: LoginComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent}, // this a out of box of spring for http://localhost:8080/api/products/1 no code need to write.
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id/:name', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule,
    PaginatorModule
  ],
  providers: [ProductService, {provide: OKTA_CONFIG, useValue: {oktaAuth}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
