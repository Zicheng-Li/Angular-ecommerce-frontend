import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }
  addToCart(theCartItem: CartItem) {
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id
      for(let tempCartItem of this.cartItems) {
        if (tempCartItem.id === theCartItem.id) {
          // alreadyExistsInCart = true;
          existingCartItem = tempCartItem;
          break;
        }
      }
       // check if we found it
    alreadyExistsInCart = (existingCartItem != undefined);
    // console.log(`alreadyExistsInCart = ${alreadyExistsInCart}
    }
   
    
    if (alreadyExistsInCart) {
      // increment the quantity
      existingCartItem!.quantity++;
    } else {
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }
  computeCartTotals() {
    throw new Error('Method not implemented.');
  }
}
