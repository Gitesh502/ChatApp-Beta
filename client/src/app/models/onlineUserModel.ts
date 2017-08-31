export class OnlineUserModel
{
    constructor()
    {
        this.profileImages=new Array<string>();
        this.posts=new Array<string>();
        this.coverImages=new Array<string>();
        this.chats=new Array<string>();
    }
    public _id:String;
    public firstName:string;
    public surName:string;
    public email:String;
    public password:String;
    public birthday:Number;
    public birthmonth:Number;
    public birthyear:Number;
    public gender:String;
    public profileImages:Array<string>;
    public posts:Array<string>;
    public coverImages:Array<string>;
    public chats:Array<string>;
    public isOnline:boolean;
}