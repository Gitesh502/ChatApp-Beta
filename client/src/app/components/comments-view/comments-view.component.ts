import { Component, OnInit, Input, Inject } from '@angular/core';
import { APP_CONFIG } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { TimelineService } from '../../services/timeline/timeline.service';
@Component({
  selector: 'app-comments-view',
  templateUrl: './comments-view.component.html',
  styleUrls: ['./comments-view.component.css']
})
export class CommentsViewComponent implements OnInit {
  @Input() p: any
  @Input() isShow: any
  private comments = [];
  private isShowCommentBox=[];
  constructor(
    @Inject(APP_CONFIG) private config: IAppConfig
    , private timelineService: TimelineService) { }

  ngOnInit() {
    this.getComments(this.p._id);
  }
  getComments(postId) {
    this.timelineService.getComments(postId)
      .subscribe(data => {
        if (data.response && data.response.length > 0) {
          data.response[0].comments.forEach((item) => {
            this.comments.push({
              comment: item.text,
              id: item.commentId
            })
          });
        }
      }, err => {
        throw new Error(err);
      })
  }
  postComment(event,parent){
    var reqObj={
      parentpostid:parent._id,
      comment:event.value,
    };
    this.timelineService.submitComment(reqObj)
    .subscribe(data=>{
      this.getComments(parent._id);
      event.value="";
    },err=>{
      console.log(err);
    })
  }

  showSubComments(parent,index)
  {
    this.isShowCommentBox[index]={

        index:index,
        display:true

    };
  console.log(this.isShowCommentBox)
  }
}
