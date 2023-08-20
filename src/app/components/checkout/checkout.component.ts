import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormService } from 'src/app/services/form.service';
import { MyValidators } from 'src/app/validators/my-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup!: FormGroup;
  totalPrice: number=0;
  totalQuantity: number=0;
  years: number[] = [];
  months: number[] = [];

  counties: Country[]=[];

  shippingAddStates: State[]=[];
  billingAddStates: State[]=[];

  constructor(private formBuilder: FormBuilder,
            private form: FormService,
            private cartService: CartService,
            private checkoutService: CheckoutService,
            private router:Router) { }

  ngOnInit(): void {

    this.reviewCartDetails();
    
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace]), // MyValidators.notOnlyWhitespace need to put it to the array with others together
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
      }),  

      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.pattern('[0-9]{16}'),Validators.required]),
        securityCode: new FormControl('', [Validators.pattern('[0-9]{3}'),Validators.required]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
    // populate the months
    const startMonth: number = new Date().getMonth() + 1; // +1 becuase it is 0 based
    console.log("start month is " + startMonth);

    this.form.getMonth(startMonth).subscribe(
      data => {
        console.log("month is " + JSON.stringify(data));
        this.months = data;
      });

    // populate the years
    this.form.getYear().subscribe(
      data => {
        console.log("year is " + JSON.stringify(data));
        this.years = data;
      });

      // populate the countries
      this.form.getCountries().subscribe(
        data => {
          console.log("countries are " + JSON.stringify(data));
          this.counties = data;
        });
  }
  reviewCartDetails() {
    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
      );
  }

  onSubmit() {
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched(); // this will trigger the display of all error messages
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(cartItem => new OrderItem(cartItem));

    // set up purchase
    let purchase = new Purchase();

    // pop customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    
    // pop shippingAddress
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;
    // pop billingAddress
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // pop order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST api via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Order has been placed successfully.\nOrder tracking number is: ${response.orderTrackingNumber}`);

          // reset cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      })
    
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("the email is " + this.checkoutFormGroup.get('customer')?.value.email);
    console.log("the shipping address  country is " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("the shipping address state is " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form data
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardName() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditCardExpirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get creditCardExpirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }

  copyShipToBill(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value)
    // to asyn the state from shipping address to billing address
    this.billingAddStates = this.shippingAddStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      // we also want to clean the billing address states
      this.billingAddStates = [];
    }
  }
  handleMandY() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the current year is equal to the year of the current month, then start with current month
    let startMonth: number;
    if (currentYear === selectYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else{
      startMonth = 1;
    }

    this.form.getMonth(startMonth).subscribe(
      data => {
        console.log("month is " + JSON.stringify(data));
        this.months = data;
      });
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode: string = formGroup?.value.country.code;
    const countryName: string = formGroup?.value.country.name;

    console.log(`country code is ${countryCode} and country name is ${countryName}`);
    this.form.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddStates = data;
        }
        else{
          this.billingAddStates = data;
        }

        // select the first state in the list
        formGroup?.get('state')?.setValue(data[0]);
      })
  }
}
    
    


