import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { RegisterModel } from '../models/registerModel';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AccountService {
  authToken:any;
  user:any;
  apiUrl:string="http://localhost:3000/users/";
  constructor(private http:Http) {

  }

  registerUser(user)
  {
    let headers=new Headers();
    headers.append("Content-Type","application/json");
    return this.http.post(this.apiUrl+"register",user,{headers:headers})
    .map(res=>res.json());
  }

  login(user)
  {
    let headers=new Headers();
    headers.append("Content-Type","application/json");
    return this.http.post(this.apiUrl+"authenticate",user,{headers:headers})
    .map(res=>res.json());
  }

  getProfile()
  {
    let headers=new Headers();
    this.loadToken();
    headers.append("Authorization",this.authToken);
    headers.append("Content-Type","application/json");
    return this.http.get(this.apiUrl+"profile",{headers:headers})
    .map(res=>res.json());
  }

  loadToken()
  {
    const token=localStorage.getItem("id_token");
    this.authToken=token;
  }

  storeUserData(token,userData)
  {
    //angular2-jwt checks for id_token in localstorage 
    //can be changes and confgured but  do not know how
    //so always should be id_token
    localStorage.setItem('id_token',token);
    localStorage.setItem('user',JSON.stringify(userData));
    this.authToken=token;
    this.user=userData;
  }
  logout()
  {
    this.authToken=null;
    this.user=null;
    localStorage.clear();
  }
}
