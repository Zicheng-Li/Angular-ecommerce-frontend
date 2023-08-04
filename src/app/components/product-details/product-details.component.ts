import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;
  
  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
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

}
