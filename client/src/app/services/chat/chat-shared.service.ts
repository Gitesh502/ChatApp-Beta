import { Injectable } from '@angular/core';
import { ChatBoxModel, MessagesModel } from '../../models/chatboxModel';


@Injectable()
export class ChatSharedService {

  /**
 * Messages variable is to store all messages of particular converstation and display when chat boxs is opened
 * Used in getMessages function below
 */
  public Messages: MessagesModel;
  public currentMsgCount = 0;
  public showMsgNotification= false;
  public newMsgCount= 0;
  constructor() {
    this.Messages = new MessagesModel();
    if (localStorage.getItem('mc') !== '' && localStorage.getItem('mc') != null) {
      this.currentMsgCount = parseInt(localStorage.getItem('mc'), 10);
    }
  }
  initMessages(data) {
    this.Messages = data;
    this.currentMsgCount = this.Messages.conversation.length;
  }
  getMessages() {
    return this.Messages;
  }
  pushMessage(message) {
    this.Messages.conversation.push(message);
  }
  newMsgReceived() {
    this.showMsgNotification = true;
    this.newMsgCount = this.newMsgCount + 1;
  }
}
