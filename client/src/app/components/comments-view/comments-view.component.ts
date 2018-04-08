import { Component, OnInit, Input, Inject } from '@angular/core';
import { APP_CONFIG } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { TimelineService } from '../../services/timeline/timeline.service';
import { SharedService } from '../../services/shared/shared.service';
@Component({
  selector: 'app-comments-view',
  templateUrl: './comments-view.component.html',
  styleUrls: ['./comments-view.component.css']
})
export class CommentsViewComponent implements OnInit {
  @Input() p: any;
  @Input() isShow: any;
  private comments = [];
  private isShowCommentBox= [];
  private indexClicked = -1;

  constructor(
    @Inject(APP_CONFIG) private config: IAppConfig
    , private timelineService: TimelineService
    , private sharedService: SharedService) { }

  ngOnInit() {
    this.getComments(this.p._id);
  }
  getComments(postId) {
    this.timelineService.getComments(postId)
      .subscribe(data => {
        this.comments = [];
        if (data.response && data.response.length > 0) {
          data.response[0].comments.forEach((item) => {
            this.comments.push({
              author: item.author,
              comment: item.text,
              id: item.commentId
            });
          });
        }
      }, err => {
        throw new Error(err);
      });
  }
  postComment(event, parent) {
    const reqObj = {
      parentpostid: parent._id,
      comment: event.value,
    };
    this.timelineService.submitComment(reqObj)
    .subscribe(data => {
      this.getComments(parent._id);
      event.value = '';
    }, err => {
      console.log(err);
    });
  }

  showSubComments(parent, index) {
    this.isShowCommentBox[index] = {
        index: index,
        display: true,
        parentComment : parent
    };
    this.indexClicked = index;
  }

  postChildComment(event, parentComment, superParent) {
    console.log('parent', parentComment);
    console.log('superparent', superParent);
    const reqObj = {
      parentPostId: superParent._id,
      parentCommentId: parentComment.id,
      comment: '<strong style="color:blue">' + parentComment.author.firstName + '</strong>' + ' ' + event.value,
    };
    this.timelineService.submitChildComment(reqObj)
    .subscribe(data => {
      this.getComments(superParent._id);
      event.value = '';
    }, err => {
      console.log(err);
    });
  }
}
