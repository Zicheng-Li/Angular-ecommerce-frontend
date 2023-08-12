import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

}
