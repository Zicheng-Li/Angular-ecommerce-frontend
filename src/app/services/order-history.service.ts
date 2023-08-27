import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private orderUrl= environment.myApiUrl +  '/orders';
  constructor(private http: HttpClient) { }

  getOrderHistory(email: string) : Observable<GetResponseOrderHistory> {
    const OrderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;
    return this.http.get<GetResponseOrderHistory>(OrderHistoryUrl);
  }
}
interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[]; 
  }
}
  

