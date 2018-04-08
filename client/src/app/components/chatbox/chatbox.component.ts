import { ChatSharedService } from './../../services/chat/chat-shared.service';
import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { ChatBoxModel, MessagesModel } from '../../models/chatboxModel';
import { ChatService } from '../../services/chat/chat.service';
import { SocketService } from '../../services/sockets/socket.service';
import { SharedService } from '../../services/shared/shared.service';
import { IAppConfig } from '../../config/iapp.config';
import { APP_CONFIG } from '../../config/app.config';
import * as io from 'socket.io-client';
import * as moment from 'moment';
import * as _ from 'underscore';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})

export class ChatboxComponent implements OnInit {

  /**
   * chatbox is input variable means its comming from other component
   * here chatbox varible data is coming from hoem component
   */
  @Input() chatbox: ChatBoxModel;
  /**
   * chatClosed is ouput varibale means , it is sneding data to other component
   * Event emitter is used to emit event to other compnents
   * when ever chatbox is closed , an event is emmited to homecomponent
   */
  @Output() chatClosed = new EventEmitter<string>();

  /**
   * boxStyleRight is for calculating of style (right) of chatbox
   */
  public boxStyleRight = 350;

  /**
   * Messages variable is to store all messages of particular converstation and display when chat boxs is opened
   * Used in getMessages function below
   */
  // public Messages: MessagesModel;

  /**
   * chatMessage is object with message as property
   * used for two way binding of text filed in message box
   */
  // public chatMessage = {
  //   message: ''
  // };

  /**
   * @param  {ChatService} chatService
   * @param  {} @Inject(APP_CONFIG
   * @param  {IAppConfig} config
   *
   */
  constructor(
    private chatService: ChatService,
    private chatShared: ChatSharedService,
    private sharedService: SharedService,
    private socketSrvice: SocketService,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
  }

  ngOnInit(): void {
    const _this = this;
    /**
     * getMessages() is to fetch all messages of opened message box
     * see method defination for moe info
     */
    _this.getMessages();
  }

  getBoxStyle(index: number): number {
    const _this = this;
    let right = 190;
    if (index > 1) {
      right = ((index - 1) * _this.boxStyleRight) + 190 + ((index - 1) * 10);
    }
    return right;
  }

  closeChatBox(userIndex) {
    const _this = this;
    _this.chatClosed.emit(userIndex);
  }

  sendMessage() {
    const _this = this;
    const message = {
      chatId: this.chatbox.key,
      message: _this.chatbox.message,
      sender: _this.config.loggedUserId,
      recipient: _this.chatbox.sentTo,
      isGroup: _this.chatbox.isGroup,
      createdOn: new Date().toISOString()
    };
    const reqMessage = {
      message: message
    };
    _this.chatService.saveMessage(message)
      .subscribe(data => {
        if (data != null && data.success) {
          _this.socketSrvice.sendMessage(data.msgToSend);
          _this.chatbox.message = '';
          _this.chatShared.pushMessage(data.msgToSend.message);
          const messages = _this.chatShared.getMessages();
            if (_.contains(messages.userIds, _this.chatbox.key)) {
              _this.chatbox.messages = messages;
            }
        } else {
          console.log(data);
        }
      },
        err => {
        });
  }
  /**
   * @returns void
   * fetches all messages based on the user id for which box is opened
   */
  getMessages(): void {
    const _this = this;
    _this.chatService.getMessages(_this.chatbox.key)
      .subscribe(data => {
        if (data != null && data.response != null && data.response.length > 0) {
          _this.chatShared.initMessages(data.response[0]);
        }
        const messages = _this.chatShared.getMessages();
        if(messages.chatId === _this.chatbox.key) {
          _this.chatbox.messages = messages;
        }
      },
        err => {
        });
  }
}
