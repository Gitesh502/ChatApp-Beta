import { ChatService } from './../../services/chat/chat.service';
import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import { OnlineUserModel } from '../../models/onlineUserModel';
import { OnlineusersService } from '../../services/onlineusers/onlineusers.service';

@Component({
  selector: 'app-onlineusers',
  templateUrl: './onlineusers.component.html',
  styleUrls: ['./onlineusers.component.css']
})
export class OnlineusersComponent implements OnInit {
  public OnlineUsers:Array<OnlineUserModel>;
  @Output() chatOpened = new EventEmitter<object>();


  constructor(
    private onlineService:OnlineusersService,
    private chatService:ChatService
  ) { 
      this.OnlineUsers=new Array<OnlineUserModel>();
     
  }
  
  ngOnInit() {
    this.getUsers();
  }
  
  getUsers()
  {
      this.onlineService.getUsers()
      .subscribe(
        data=>{
          console.log(data.response);
          this.OnlineUsers=data.response;
        },
        err=>{
        }
      )
  }
  
  openChat(user){
    let chatBox={
      key:user._id,
      index:0,
      user:user
    }
    this.chatOpened.emit(chatBox);
  }

}
