import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
@Injectable()
export class HelperService {

  constructor() { }
  loggedIn()
  {
    return tokenNotExpired('id_token');
  }
}
