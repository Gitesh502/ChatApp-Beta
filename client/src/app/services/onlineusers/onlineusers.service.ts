import { Injectable,Inject } from '@angular/core';
import { Http,Headers } from '@angular/http';
import { IAppConfig } from '../../config/iapp.config';
import { APP_CONFIG } from '../../config/app.config';

@Injectable()
export class OnlineusersService {

  constructor(private http:Http,@Inject(APP_CONFIG) private config: IAppConfig) { }
  
  getUsers()
  {
    let headers = new Headers();
    headers.append("Authorization", this.config.authToken);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.config.apiEndpoint + "users/getAll", { headers: headers })
      .map(res => res.json());
  }
}
