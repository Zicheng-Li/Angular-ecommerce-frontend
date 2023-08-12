import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { FormService } from 'src/app/services/form.service';

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

  constructor(private formBuilder: FormBuilder,
            private form: FormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
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
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("the email is " + this.checkoutFormGroup.get('customer')?.value.email);
  }
  copyShipToBill(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value)
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
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
    

}
