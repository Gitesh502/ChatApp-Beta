import { Injectable ,Inject} from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { RegisterModel } from '../../models/registerModel';

import { tokenNotExpired } from 'angular2-jwt';
import { IAppConfig } from '../../config/iapp.config';
import { APP_CONFIG } from '../../config/app.config';

@Injectable()
export class AccountService {
  apiUrl:string="";
  constructor(private http:Http,@Inject(APP_CONFIG) private config: IAppConfig) {
    this.apiUrl=config.apiEndpoint;
  }

  registerUser(user){
    let headers=new Headers();
    headers.append("Content-Type","application/json");
    return this.http.post(this.apiUrl+"users/register",user,{headers:headers})
    .map(res=>res.json());
  }

  login(user)
  {
    let headers=new Headers();
    headers.append("Content-Type","application/json");
    return this.http.post(this.apiUrl+"users/authenticate",user,{headers:headers})
    .map(res=>res.json());
  }

  getProfile()
  {
    let headers =new Headers();
    headers.append('Authorization',this.config.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get(this.apiUrl + 'users/profile',{headers:headers})
    .map(res => res.json());
  }


  logout()
  {
    this.config.authToken = null;
    this.config.loggedUserId = null;
    localStorage.clear();
  }
}
