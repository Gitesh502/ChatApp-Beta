export class UserPosts
{
    public PostId:Number;
    public PostTitle:String;
    public PostDescription:String;
    public IsActive:Boolean;
    public PostedBy:String;
    public PostedOn:String;
    public PostedDate:string;
    public Privacytype:Number;
}

export class UserModel
{
    public id:String;
    public firstName:string;
    public surName:string;
    public email:String;
    public password:String;
    public birthday:Number;
    public birthmonth:Number;
    public birthyear:Number;
    public gender:String;
    public profileImages:Array<profileImageModel>
}

export class profileImageModel
{
    public fileName:string;
    public iconName:string;
    public fullPath:String;
    public imagePath:String;
    public imagetitle:String;

}