import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget'; // ts declaration file
import myAppConfig from 'src/app/config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  okatSignin: any;
  constructor(@Inject(OKTA_AUTH) private oktaAuth : OktaAuth ) {
    this.okatSignin = new OktaSignIn({
      logo : 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redrictUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true, // passing the info between our app and authorization server.
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });
   }

  ngOnInit(): void {
    this.okatSignin.remove();

    this.okatSignin.renderEl({
      el: '#okta-sign-in'},  // this name should be same as in html file
      (response : any) => {
        if(response.status === 'SUCCESS'){
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error : any) => {
        throw error;
      });
      
  }



}
    
  
  


