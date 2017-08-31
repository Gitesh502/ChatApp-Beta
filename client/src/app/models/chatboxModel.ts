import { UserModel } from './profileModel';

export class chatBoxModel {
    public key:string;
    public index:number;
    public user:object;
}

export class conversations
{
    public createdOn:Date;
    public message:String;
    public recipient:String;
    public sender:String;
}

export class MessagesModel{
    constructor()
    {
        this.conversation=new Array<conversations>();
        this.isDelete=false;
        this.userIds=new Array<String>();
    }
    public conversation:Array<conversations>;
    public isDelete:Boolean;
    public isGroup:Boolean;
    public updated_at:Date;
    public userIds:Array<String>;
    public _id:String;
}

export class MessengerModel
{
    public id:string;
    public UserIds:Array<UserModel>;
    public Messages:MessagesModel;
}

export class ChatDisplayed
{
    public id:string;
    public senderId:string;
    public recipientId:string;
    public senderName:string;
    public recipientName:string;
    public senderProPic:string;
    public recipientProPic:string;
    public messageDate:Date;
}