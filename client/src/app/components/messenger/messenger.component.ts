import * as moment from 'moment';
import * as _ from 'underscore';
import * as io from 'socket.io-client';

import { Component, OnInit, Inject } from '@angular/core';
import { APP_CONFIG } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { MessengerModel } from '../../models/chatboxModel';
import { MessagesModel, ChatDisplayed } from './../../models/chatboxModel';
import { ChatService } from '../../services/chat/chat.service';
import { ChatSharedService } from './../../services/chat/chat-shared.service';
import { SocketService } from './../../services/sockets/socket.service';

import { PushNotificationsService } from 'angular2-notifications'; //import the service


@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {
  public messengerList: Array<MessengerModel>;
  public converstation: MessengerModel;
  public chatMessage = {
    message: ''
  };
  public toUserId: string;
  public Messages: MessagesModel;
  public messagesDetailsList: any = [];
  constructor(
    private chatService: ChatService,
    private chatShared: ChatSharedService,
    private socketService: SocketService,
    @Inject(APP_CONFIG) private config: IAppConfig,
    private _pushNotifications: PushNotificationsService
  ) {
    this.toUserId = '';
    this.messengerList = new Array<MessengerModel>();
    this.converstation = new MessengerModel;
    this.Messages = new MessagesModel();
  }

  ngOnInit() {
    this.getMessengers();
  }

  getMessengers() {
    const self = this;
    self.chatService.getMessengers()
      .subscribe(
      data => {
        console.log(data);
        _.map(data.response, (item) => {
          self.messagesDetailsList.push(item);
          self.messengerList.push({ id: item._id, UserIds: item.userIds, Messages: item.conversation })
        });
      },
      err => {
      }
      );
  }

  getMessages(id: string) {
    const self = this;
    const messages = _.where(self.messengerList, { id: id });
    const messagesList = _.where(self.messagesDetailsList, { _id: id });
    self.converstation = messages[0];
    self.toUserId = messages[0].UserIds[0]._id;
    self.chatShared.initMessages(messagesList[0]);
    self.Messages = self.chatShared.getMessages();
  }
  sendMessage() {
    const _this = this;
    const message = {
      message: _this.chatMessage.message,
      from: _this.config.loggedUserId,
      to: _this.toUserId
    };
    _this.socketService.sendMessage(message);
    _this.chatMessage.message = '';
    _this.chatShared.pushMessage(message.message);
  }

}
