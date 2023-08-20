import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean =false;
  userFullName: string = '';

  stroge: Storage = sessionStorage;

  constructor( private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  ngOnInit(): void {
    // subscribe to the authentication state change
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      });
      
  }
  getUserDetails() {
    if(this.isAuthenticated) {
      // get the user details using the access token
      this.oktaAuth.getUser().then(
        (user) => {
          this.userFullName = user.name as string;
          //fdfsdfdsc
          //dsfsd

          // retrieve the user email from authentication response
          const theEmail = user.email;
          // now store the email in session storage
          this.stroge.setItem('theEmail', JSON.stringify(theEmail));
        }
      )
    }
  }
  
  logout() {
    // terminates the session in Okta, revokes the token, and redirects back to the home page
    this.oktaAuth.signOut();
  }

}
