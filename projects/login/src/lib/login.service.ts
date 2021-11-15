import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class loginClass{
  constructor(
      public email : string,
      public password : string,
  ){}
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  urlLogin = "https://www.api.loker.bogorstudio.com/api/Users/login"

  constructor( private htpp : HttpClient) { }

  postLogin(login:any){
    return this.htpp.post(this.urlLogin,login)
  }
}
