import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
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
            private form: FormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace]), // MyValidators.notOnlyWhitespace need to put it to the array with others together
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
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
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
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

  onSubmit() {
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched(); // this will trigger the display of all error messages
    }

    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("the email is " + this.checkoutFormGroup.get('customer')?.value.email);
    console.log("the shipping address  country is " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("the shipping address state is " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
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
    
    


