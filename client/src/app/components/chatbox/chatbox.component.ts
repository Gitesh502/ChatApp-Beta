import { ChatSharedService } from './../../services/chat/chat-shared.service';
import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { chatBoxModel, MessagesModel } from '../../models/chatboxModel';
import { ChatService } from '../../services/chat/chat.service';
import {SharedService} from '../../services/shared/shared.service';
import { IAppConfig } from '../../config/iapp.config';
import { APP_CONFIG } from '../../config/app.config';
import * as io from 'socket.io-client';
import * as moment from 'moment';

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
  @Input() chatbox: chatBoxModel;
  /**
   * chatClosed is ouput varibale means , it is sneding data to other component
   * Event emitter is used to emit event to other compnents
   * when ever chatbox is closed , an event is emmited to homecomponent 
   */
  @Output() chatClosed = new EventEmitter<string>();

  /**
   * boxStyleRight is for calculating of style (right) of chatbox
   */
  public boxStyleRight: number = 350;

  /**
   * Messages variable is to store all messages of particular converstation and display when chat boxs is opened
   * Used in getMessages function below
   */
  public Messages: MessagesModel;

  /**
   * chatMessage is object with message as property 
   * used for two way binding of text filed in message box
   */
  public chatMessage = {
    message: ""
  };

  /**
   * @param  {ChatService} chatService 
   * @param  {} @Inject(APP_CONFIG
   * @param  {IAppConfig} config
   * 
   */
  constructor(
    private chatService: ChatService,
    private chatShared:ChatSharedService,
    private sharedService:SharedService,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    this.chatbox = new chatBoxModel();
    this.Messages = new MessagesModel();
  }

  ngOnInit(): void {
    var _this = this;
    /**
     * getMessages() is to fetch all messages of opened message box
     * see method defination for moe info
     */
    _this.getMessages();
    /**
     * Its a function for getting new message when other use sends an message
     * from socket io calling this method 
     */
    // _this.chatService.newMessage()
    //   .subscribe(data => {
    //     _this.chatShared.pushMessage(data.text.message);
    //     //_this.Messages.conversation.push(data.text.message);
    //   }
    //   );
  }

  getBoxStyle(index: number): number {
    var _this = this;
    let right = 190;
    if (index > 1) {
      right = ((index - 1) * _this.boxStyleRight) + 190 + ((index - 1) * 10);
    }
    return right;
  }

  closeChatBox(userIndex) {
    var _this = this;
    _this.chatClosed.emit(userIndex);
  }

  sendMessage() {
    var _this = this;
    var message = {
      message: _this.chatMessage.message,
      from: _this.config.loggedUserId,
      to: _this.chatbox.key
    }
    _this.chatService.saveMessage(message)
      .subscribe(data => {
        _this.chatService.send(data.response);
        _this.chatMessage.message = "";
        _this.chatShared.pushMessage(data.response.message);
       // _this.Messages.conversation.push(data.response.message);
      },
      err => {
      });
  }
  /**
   * @returns void
   * fetches all messages based on the user id for which box is opened
   */
  getMessages():void {
    var _this = this;
    _this.chatService.getMessages(_this.chatbox.key)
      .subscribe(data => {
       // _this.Messages = data.response[0];
       _this.chatShared.initMessages(data.response[0]);
       _this.Messages=_this.chatShared.getMessages();
      },
      err => {
      });
  }
}
