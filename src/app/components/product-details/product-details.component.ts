import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;
  searchMode: boolean = false;
  keyword: string = '';
  
  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.keyword = params['keyword'];
      this.searchMode = params['searchMode'] === 'true'; // params['searchMode'] this is a string 
    });

    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
  })
}
  handleProductDetails() {
    // get the id from the url, convert it to a number using "+" symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    // get the product from the service
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      })
      
  }

  addToCart(){
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }
}
  

