import * as moment from 'moment';
import * as _ from 'underscore';
import { Component, OnInit,Inject } from '@angular/core';
import { APP_CONFIG } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { MessengerModel } from '../../models/chatboxModel';
import { MessagesModel,ChatDisplayed } from './../../models/chatboxModel';
import { ChatService } from '../../services/chat/chat.service';


@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {
  public messengerList: Array<MessengerModel>;
  public converstation:MessengerModel;
  
  constructor(
    private chatService: ChatService,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
      this.messengerList=new Array<MessengerModel>();
      this.converstation=new MessengerModel;
  }

  ngOnInit() {
    this.getMessengers();
  }

  getMessengers() {
    var self = this;
    self.chatService.getMessengers()
      .subscribe(
      data => {
        _.map(data.response,(item)=>{
          self.messengerList.push({id:item._id,UserIds:item.userIds,Messages:item.conversation})
        });
        console.log(self.messengerList);
      },
      err => {
      }
      )
  }

  getMessages(id:string)
  {
    var self=this;
    var messages=_.where(self.messengerList,{id:id});
    self.converstation=messages;
    console.log(self.converstation);
  }
}
