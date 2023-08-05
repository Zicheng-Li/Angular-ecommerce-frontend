import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

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

  // new properties for pagination
    thePageNumber: number = 1;
    thePageSize: number = 10;
    theTotalElements: number = 0;
  
  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

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
    // now search for the products using the keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      });
  }

  handleListProducts() {
     // check id id parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // get the id parameter, convert string to number using the + symbol, the '!' is asseration operator to tell the compiler error.
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else{
      this.currentCategoryId = 1;
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
    this.productService.getProductListPaginate(this.currentCategoryId
                                  , this.thePageNumber - 1, 
                                    this.thePageSize).subscribe(
      data => { 
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
  }
    )
  }
}
