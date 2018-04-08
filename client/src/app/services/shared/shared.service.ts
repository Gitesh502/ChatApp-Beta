import { Injectable, Inject } from '@angular/core';
import { IAppConfig } from '../../config/iapp.config';
import { APP_CONFIG } from '../../config/app.config';
import { UserModel } from '../../models/profileModel';
@Injectable()
export class SharedService {
  friendRequests = [];
  receivedFriendRequest = [];
  onlineUsers= [];
  notifictaions = [];
  groupChats = [];
  constructor( @Inject(APP_CONFIG) private config: IAppConfig) {
  }

  getLocalStorageByKey(key) {
    if (localStorage.getItem(key) != null && localStorage.getItem(key).length > 0) {
    return JSON.parse(localStorage.getItem(key));
    }
    return null;
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
    const socketToken = localStorage.getItem('socketToken');
    this.config.authToken = token;
    this.config.socketToken = socketToken;
    if (JSON.parse(localStorage.getItem('user')) != null) {
      this.config.loggedUserId = JSON.parse(localStorage.getItem('user')).id;
    }
    return token;
  }
  storeUserData(token, userData, socketToken) {
    // angular2-jwt checks for id_token in localstorage
    // can be changes and confgured but  do not know how
    // so always should be id_token
    localStorage.setItem('socketToken', socketToken);
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    this.config.authToken = token;
    this.config.loggedUserId = userData.id;
    this.config.socketToken = socketToken;
  }
  clearLocalStorage() {
    localStorage.clear();
    this.config.authToken = null;
    this.config.loggedUserId = null;
    this.config.socketToken = null;
  }

  getReceivedFriendRequests() {
    return this.receivedFriendRequest;
  }

  setReceivedFriendRequest(data) {
    this.receivedFriendRequest = data;
  }

  removeFriendRequest(data) {
    const index = this.receivedFriendRequest.indexOf(data);
    if (index > -1) {
      this.receivedFriendRequest.splice(index, 1);
    }
  }

  getOnlineUsers() {
    return this.onlineUsers;
  }

  setOnlineUsers(data) {
    this.onlineUsers = data;
  }

  pushOnlineUsers(data) {
    this.onlineUsers.push(data);
  }

  removeOnlineUsers(data) {
    const index = this.onlineUsers.indexOf(data);
    if (index > -1) {
      this.onlineUsers.splice(index, 1);
    }
  }

}
