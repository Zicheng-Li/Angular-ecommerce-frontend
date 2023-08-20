import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[]=[];
  storage: Storage= sessionStorage;
  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
    
  
  }
  handleOrderHistory() {
    // read the email from the session storage
    const theEmail =JSON.parse(this.storage.getItem("theEmail")!);
    console.log(theEmail);

    // retrieve the order history list
    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
      });
      console.log(this.orderHistoryList);
      

  }

}