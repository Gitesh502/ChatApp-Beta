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
      query: 'token=' + self.config.socketToken,
      reconnection: false
    };
    self.socket = io.connect('http://localhost:4000', socketOpts);
    self.socket.once('connect', function() {
      self.socket.emit('join', self.config.loggedUserId);
    });
    self.socket.on('unauthorized', function(error) {
      if (error.data.type === 'UnauthorizedError' || error.data.code === 'invalid_token') {
        alert('User\'s token has expired');
      }
    });
    self.socket.on('error', function(error) {
        console.log(error);
    });
  }
  sendMessage(data: any) {
    this.socket.emit('send-message', data);
  }
  sendFriendRequest(id: any) {
    this.socket.emit('send-request', id);
  }
  friendRequestAccepted(id) {
    this.socket.emit('request-accepted', id);
  }





  receiveMessage(): Observable<any> {
    return Observable.create(observer => {
      this.socket.on('receive-message', (item: any) => observer.next(item));
    });
  }
  receiveRequest(): Observable<any> {
    const self = this;
    return Observable.create(observer => {
      self.socket.on('receive-request', (item: any) => observer.next(item));
    });
  }
  friendRequestAcceptedNotification(): Observable<any> {
    const self = this;
    return Observable.create(observer => {
      self.socket.on('friend-request-accepted-notification', (item: any) => observer.next(item));
    });
  }
  onlineUsers(): Observable<any> {
    const self = this;
    return Observable.create(observer => {
      self.socket.on('online-users', (item: any) => observer.next(item));
    });
  }

}
