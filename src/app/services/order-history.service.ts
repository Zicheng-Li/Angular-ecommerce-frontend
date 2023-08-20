import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private orderUrl= 'http://localhost:8080/api/orders';
  constructor(private http: HttpClient) { }

  getOrderHistory(email: string) : Observable<GetResponseOrderHistory> {
    const OrderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmail?email=${email}`;
    return this.http.get<GetResponseOrderHistory>(OrderHistoryUrl);
  }
}
interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[]; 
  }
}
  

