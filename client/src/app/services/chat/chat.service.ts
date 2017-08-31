import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { IAppConfig } from '../../config/iapp.config';
import { APP_CONFIG } from '../../config/app.config';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable()
export class ChatService {
  socket: SocketIOClient.Socket;
  constructor(
    private http: Http,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    var _that = this;
    var socketOpts = {
      query: "userId=" + config.loggedUserId,
      reconnection: false
    };
    _that.socket = io.connect("http://localhost:4000", socketOpts);
    _that.socket.once('connect', function () {
      _that.socket.emit('join', config.loggedUserId);
    });
  }

  saveMessage(message) {
    let headers = new Headers();
    headers.append("Authorization", this.config.authToken);
    headers.append("Content-Type", "application/json");
    return this.http.post(this.config.apiEndpoint + "chat/save", message, { headers: headers })
      .map(res => res.json());
  }

  getMessages( to: string) {
    let headers = new Headers();
    headers.append("Authorization", this.config.authToken);
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers, params: {  toId: to } });
    return this.http.get(this.config.apiEndpoint + "chat/getMessages", options)
      .map(res => res.json());
  }

  getChatId(to: string) {
    let headers = new Headers();
    headers.append("Authorization", this.config.authToken);
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers, params: { toId: to } });
    return this.http.get(this.config.apiEndpoint + "chat/getChatId", options)
      .map(res => res.json());
  }

  getMessengers()
  {
    let headers = new Headers();
    headers.append("Authorization", this.config.authToken);
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers});
    return this.http.get(this.config.apiEndpoint + "chat/getMessengers",options)
      .map(res => res.json());
  }

  onConnect(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('joined', () => observer.complete());
    })
  }

  onDisconnect(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('disconnect', () => observer.complete());
    })
  }

  // Get items observable
  items(): Observable<any> {
    return Observable.create(observer => {
      this.socket.on('item', (item: any) => observer.next(item));
    });
  }

  // Get items observable
  newMessage(): Observable<any> {
    return Observable.create(observer => {
      this.socket.on('new-message', (item: any) => observer.next(item));
    });
  }

  // Request initial list when connected
  list(): void {
    this.socket.emit('list');
  }


  // Create signal
  create(params: any) {
    this.socket.emit('create', params);
  }

  // Remove signal
  remove(params: any) {
    this.socket.emit('remove', params);
  }

  send(data: any) {
    this.socket.emit('transmit-message', data);
  }

  subscribe(data: any) {
    this.socket.emit('join', data);
  }


}
