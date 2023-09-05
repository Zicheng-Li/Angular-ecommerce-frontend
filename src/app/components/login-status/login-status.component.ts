import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {
 
  userFullName: string = '';

  storage: Storage = sessionStorage;

  constructor( @Inject(DOCUMENT) public document: Document, public auth: AuthService) { }

  ngOnInit(): void {
    // Retrieve user details and store the email in sessionStorage
    this.auth.idTokenClaims$.subscribe(claims => {
      if (claims) {
        if (claims.name) {
          this.userFullName = claims.name;
        }
        if (claims.email) {
          const userEmail = claims.email;
          this.storage.setItem('userEmail', userEmail);
        }
      }
    });
  }

  handleLogout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: this.document.location.origin
      }
    });
  }
    
  
}
