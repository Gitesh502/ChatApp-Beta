import { Injectable, Inject } from '@angular/core';
import { IAppConfig } from '../../config/iapp.config';
import { APP_CONFIG } from '../../config/app.config';
import { UserModel } from '../../models/profileModel';
@Injectable()
export class SharedService {
  friendRequests = [];
  constructor( @Inject(APP_CONFIG) private config: IAppConfig) {
  }

  getLocalProfile(): UserModel {
    let profile: UserModel;
    if (localStorage.getItem('user') != null
      && localStorage.getItem('user').length > 0 && JSON.parse(localStorage.getItem('user')) != null) {
      profile = JSON.parse(localStorage.getItem('user'));
    }
    return profile;
  }
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.config.authToken = token;
    if (JSON.parse(localStorage.getItem('user')) != null) {
      this.config.loggedUserId = JSON.parse(localStorage.getItem('user')).id;
    }
    return token;
  }
  storeUserData(token, userData) {
    // angular2-jwt checks for id_token in localstorage
    // can be changes and confgured but  do not know how
    // so always should be id_token
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    this.config.authToken = token;
    this.config.loggedUserId = userData.id;
  }
  clearLocalStorage() {
    localStorage.clear();
    this.config.authToken = null;
    this.config.loggedUserId = null;
  }
}
