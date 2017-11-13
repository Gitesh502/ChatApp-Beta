import { Injectable, Inject } from '@angular/core';
import { IAppConfig } from '../../config/iapp.config';
import { APP_CONFIG } from '../../config/app.config';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class SocketService {
  socket: SocketIOClient.Socket;
  constructor( @Inject(APP_CONFIG) private config: IAppConfig) { }

  connect() {
    const self = this;
    const socketOpts = {
      query: 'userId=' + self.config.loggedUserId,
      reconnection: false
    };
    self.socket = io.connect('http://localhost:4000', socketOpts);
    self.socket.once('connect', function () {
      self.socket.emit('join', self.config.loggedUserId);
    });
  }
  sendMessage(data: any) {
    this.socket.emit('transmit-message', data);
  }
  newMessage(): Observable<any> {
    return Observable.create(observer => {
      this.socket.on('new-message', (item: any) => observer.next(item));
    });
  }



  sendFriendRequest(id: any) {
    this.socket.emit('friend-request', id);
  }
  newRequest(): Observable<any> {
    const self = this;
    return Observable.create(observer => {
      self.socket.on('new-request', (item: any) => observer.next(item));
    });
  }

}
