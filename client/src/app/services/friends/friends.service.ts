import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { IAppConfig } from '../../config/iapp.config';
import { APP_CONFIG } from '../../config/app.config';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Rx';



@Injectable()
export class FriendsService {
  headers = new Headers();
  socket: SocketIOClient.Socket;
  constructor(private http: Http, @Inject(APP_CONFIG) private config: IAppConfig) {
    const socketOpts = {
      query: 'userId=' + config.loggedUserId,
      reconnection: false
    };
    this.socket = io.connect('http://localhost:4000', socketOpts);
  }

  getPeople() {
    this.headers = new Headers();
    this.headers.append('Authorization', this.config.authToken);
    this.headers.append('Content-Type', 'application/json');
    return this.http.get(this.config.apiEndpoint + 'friends/getPeople', { headers: this.headers })
      .map(res => res.json());
  }

  sendFriendRequest(req: any) {
    this.headers = new Headers();
    this.headers.append('Authorization', this.config.authToken);
    this.headers.append('Content-Type', 'application/json');
    const reqObj = {
      reqUserId: req
    };
    return this.http.post(this.config.apiEndpoint + 'friends/sendFriendRequest', reqObj, {headers: this.headers})
    .map(res => res.json());
  }

  getFriendRequests()
  {
    this.headers=new Headers();
    this.headers.append('Authorization',this.config.authToken);
    this.headers.append('Content-Type','application/json');
    return this.http.get(this.config.apiEndpoint+'friends/getReceivedFriendRequests',{headers:this.headers})
    .map(res=>res.json());
  }

  confirmRequest(req:any){
    this.headers=new Headers();
    this.headers.append('Authorization',this.config.authToken);
    this.headers.append('Content-Type','application/json');
    return this.http.post(this.config.apiEndpoint+"friends/confirmRequest",req,{headers:this.headers})
    .map(res=>res.json());
  }

  deleteRequest(req:any){
    this.headers=new Headers();
    this.headers.append('Authorization',this.config.authToken);
    this.headers.append('Content-Type','application/json');
    return this.http.post(this.config.apiEndpoint+"friends/deleteRequest",req,{headers:this.headers})
    .map(res=>res.json());
  }
}
