import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { loginClass, LoginService } from './login.service';
import notify from 'devextreme/ui/notify'
import { Router } from '@angular/router';

@Component({
  selector: 'lib-login',
  template: `
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap');
      .card-login {
          width: 350px;
          border-radius: 12px;
          box-shadow: 0 10px 30px 0 rgb(31 45 61 / 25%);
      }
      
      .card-title {
          font-size: 1.7rem;
          font-weight: 500;
          text-align: center;
          font-family: 'Roboto Slab', serif;
      }
      
      .card-akun {
          border-radius: 6px;
          margin: 0.8rem 0;
          text-align: center;
      }

      .register{
        color:#338AC2;
        cursor:pointer;
      }
      .lupaPassword{
        color:#338AC2;
        cursor:pointer;
      }
      
      a {
          text-decoration: none;
      }
      
      .dx-fieldset {
          margin: 20px 10px;
      }
      
      .dx-field {
          margin: 1.6rem 0;
      }
      
      .form-label {
          font-weight: 500;
          font-size: 1rem;
      }
      
      .dx-field-value {
          width: 100% !important;
      }
      
      @media only screen and (max-width: 1200px) {}
      
      @media only screen and (max-width: 998px) {}
      
      @media only screen and (max-width: 767px) {}
      
      @media only screen and (max-width: 480px) {
          .card-login {
              width: 300px;
              border-radius: 12px;
              box-shadow: 0 10px 30px 0 rgb(31 45 61 / 25%);
          }
      }
      @media only screen and (max-width: 320px) {
          .card-login {
              width: 100%;
          }
      }
      </style>
      <div class="container">
      <div class="row justify-content-md-center">
          <div class="col-12 mt-5">
              <div class="card card-login mx-auto">
                  <div class="card-body">
                      <div class="card-title ">
                          Log In 
                      </div>
                      <form action="">
                          <div class="dx-fieldset">
                              <div class="dx-field">
                                  <div class="dx-field-value">
                                      <label class="form-label">Email address</label>
                                      <dx-text-box valueChangeEvent="keyup" id="email" [(value)]="email" [showClearButton]="true" placeholder="Enter Email">
                                          <dx-validator>
                                              <dxi-validation-rule type="required" message="Email harus di isi"></dxi-validation-rule>
                                              <dxi-validation-rule type="email" message="Email tidak benar"></dxi-validation-rule>
                                              <dxi-validation-rule type="async" [validationCallback]="validasi">
                                              </dxi-validation-rule>
                                          </dx-validator>
                                      </dx-text-box>
                                  </div>
                              </div>
                              <div class="dx-field">
                                  <div class="dx-field-value">
                                      <label class="form-label d-flex">
                                        Password
                                        <span class="me-auto"></span>
                                        <span class="">
                                          <a class="lupaPassword" (click)="routeLupaPassword()">Lupa Password ?</a>
                                        </span>
                                      </label>
                                      <dx-text-box valueChangeEvent="keyup" [(value)]="password" [(mode)]="modePassword" placeholder="Enter Password" [showClearButton]="true">
                                          <dx-validator>
                                              <dxi-validation-rule type="required" message="Password harus di isi"></dxi-validation-rule>
                                              <dxi-validation-rule type="async" [validationCallback]="validasi">
                                              </dxi-validation-rule>
                                          </dx-validator>
                                          <dxi-button name="today" location="after" [options]="passwordButton"></dxi-button>
                                      </dx-text-box>
                                  </div>
                              </div>
                          </div>
                          <div class="card card-akun">
                              <div class="card-body">
                                  Buat Akun? <a class="register" (click)="routeRegister()">Register</a>
                              </div>
                          </div>
                          <div class="d-grid gap-2">
                              <button class="btn btn-primary" type="button" (click)="submitLogin()">
                                <span *ngIf="showSpin" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Log In</button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  </div>
  `,
  styles: [
  ]
})

export class LoginComponent implements OnInit {
  @Output() getValue:any = new EventEmitter<loginClass>();
  @Input() registerRoute:any;
  @Input() lupaPasswordRoute:any

  email:string = '';
  password:string = '';
  showSpin:boolean = false
  modePassword = ""
  passwordButton: any
  constructor(
    private loginService : LoginService,
    private router :Router
  ) { 
    this.modePassword = 'password';
    this.passwordButton = {
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB7klEQVRYw+2YP0tcQRTFz65xFVJZpBBS2O2qVSrRUkwqYfUDpBbWQu3ELt/HLRQ/Q8RCGxVJrRDEwj9sTATxZ/Hugo4zL/NmV1xhD9xi59177pl9986fVwLUSyi/tYC+oL6gbuNDYtyUpLqkaUmfJY3a+G9JZ5J2JW1J2ivMDBSxeWCfeBxYTHSOWMcRYLOAEBebxtEVQWPASQdi2jgxro4E1YDTQIJjYM18hszGbew4EHNq/kmCvgDnHtI7YBko58SWgSXg1hN/btyFBM0AlwExczG1YDZrMS4uLUeUoDmgFfjLGwXEtG05wNXyTc4NXgzMCOAIGHD8q0ATuDZrempkwGJ9+AfUQ4K+A/eEseqZ/UbgdUw4fqs5vPeW+5mgBvBAPkLd8cPju+341P7D/WAaJGCdOFQI14kr6o/zvBKZYz11L5Okv5KGA89Kzu9K0b0s5ZXt5PjuOL6TRV5ZalFP4F+rrnhZ1Cs5vN6ijmn7Q162/ThZq9+YNW3MbfvDAOed5cxdGL+RFaUPKQtjI8DVAr66/u9i6+jJzTXm+HFEVqxVYBD4SNZNKzk109HxoycPaG0bIeugVDTp4hH2qdXJDu6xOAAWiuQoQdLHhvY1aEZSVdInG7+Q9EvSz9RrUKqgV0PP3Vz7gvqCOsUj+CxC9LB1Dc8AAAASdEVYdEVYSUY6T3JpZW50YXRpb24AMYRY7O8AAAAASUVORK5CYII=",
        type: "default",
        onClick: () => {
            this.modePassword = this.modePassword === "text" ? "password" : "text";
        }
    };
  }

  ngOnInit(): void {
  }

  validasi(params:any){
    const validasi = (value:any) =>{
      const valid = "%$#@!";
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(value !== valid);
          }, 1000);
      });    
    }
    return validasi(params.value);
  }
  

  submitLogin(){
    const login = {
      email : this.email,
      password : this.password
    }

    this.getValue.emit(login);

  }

  routeRegister(){
    this.router.navigate([`/${this.registerRoute}`])
  }

  routeLupaPassword(){
    this.router.navigate([`/${this.lupaPasswordRoute}`])
  }
}
