import { Injectable,Inject } from '@angular/core';
import { IAppConfig } from '../iapp.config';
import { APP_CONFIG } from '../app.config';
@Injectable()
export class SharedService {
  constructor(@Inject(APP_CONFIG) private config: IAppConfig) { 
  }

  getLocalProfile(): Object {
    let profileName: object ;
    if (localStorage.getItem("user") != null && localStorage.getItem("user").length > 0 && JSON.parse(localStorage.getItem("user")) != null)
      profileName = JSON.parse(localStorage.getItem("user"));
    return profileName;
  }
  loadToken()
  {
    const token=localStorage.getItem("id_token");
    this.config.authToken=token;
    this.config.loggedUser=JSON.parse(localStorage.getItem("user"));
    return token;
  }
  storeUserData(token,userData)
  {
    //angular2-jwt checks for id_token in localstorage 
    //can be changes and confgured but  do not know how
    //so always should be id_token
    localStorage.setItem('id_token',token);
    localStorage.setItem('user',JSON.stringify(userData));
    this.config.authToken=token;
    this.config.loggedUser=userData;
  }

}
