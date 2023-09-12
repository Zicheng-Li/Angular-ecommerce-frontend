import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list.component.html', 
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {


  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number=1;
  searchMode: boolean = false;
  currentCategoryName: string = '';

  // new properties for pagination
    thePageNumber: number = 1;
    thePageSize: number = 5;
    theTotalElements: number = 0;

    previousKeyword: string = '';
  
  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
    this.handleListProducts(); 
    }
}
  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // if we have different keyword than previous, then set thePageNumber back to 1
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);
    // now search for the products using the keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
      this.thePageSize,
      theKeyword).subscribe({
        next: data => { 
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number + 1;
          this.thePageSize = data.page.size;
          this.theTotalElements = data.page.totalElements;
          console.log('Request finished', data);
    },
    error: err => {
      console.error('Error:', err);
    }}
      );
  }
  
  
  handleListProducts() {
     // check id id parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // get the id parameter, convert string to number using the + symbol, the '!' is asseration operator to tell the compiler error.
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    else{
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    //
    // Check if we have a different category id than previous
    // If we do, set thePageNumber back to 1, otherwise keep thePageNumber the same.
    // This is to avoid a situation where the user could be
    // in a page that is out of range.
    //
    // This code is not required if you do not want to
    // reset thePageNumber to 1 when the category changes.

    // Notes: Angular will reuse a component if it is currently being viewed
    //
    if(this.previousCategoryId !== this.currentCategoryId){
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);
    this.productService.getProductListPaginate(this.thePageNumber - 1, // there is a serious bug, the order of parameter is different than productService.getProductListPaginate parameter, so make load the page error, make infinite loop.
      this.thePageSize,
      this.currentCategoryId).subscribe({
      next: data => { 
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
        console.log('Request finished', data);
  },
  error: err => {
    console.error('Error:', err);
  }}
    );
  }


  updatePageSize(event : PageEvent) {
    this.thePageSize = event.rows || this.thePageSize; 
    this.thePageNumber = (event.page || 0) + 1;
    this.listProducts();
    }

    addToCart(product: Product) {
      console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`);
      // TODO: Add code to add product to cart
      const theCartItem = new CartItem(product);
      this.cartService.addToCart(theCartItem);
    
    }

    onProductClicked(productId: number) {
      this.router.navigate(['/products', productId], {
        queryParams: {
          keyword: this.previousKeyword,
          searchMode: this.searchMode.toString()
        }
      });
    }
    
  } 

  
  
  interface PageEvent {
    first?: number;
    rows?: number;
    page?: number;
    pageCount?: number;
}
