import { SharedService } from './../../services/shared/shared.service';
import * as moment from 'moment';
import * as _ from 'underscore';
import { APP_CONFIG } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { GroupByPipe } from '../../pipes/group-by-pipe.pipe';
import { UserPosts, UserModel } from '../../models/profileModel';
import { ProfileService } from '../../services/profile/profile.service';
import { TimelineService } from '../../services/timeline/timeline.service';
import { SocketService } from '../../services/sockets/socket.service';
import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit, AfterViewInit {
  public formFirstSubmit: Boolean = false;
  public formProcessing: Boolean = false;
  public userPost: UserPosts;
  public postsList: Array<object>;
  public currentUrl: string = window.location.href;
  private localPostId = '';

  private isShowComments: any;

  // private loadComponent:Boolean=false;
  constructor(
    private groupBy: GroupByPipe,
    private profileService: ProfileService,
    private modalService: ModalService,
    private timelineService: TimelineService,
    private socketService: SocketService,
    private sharedService: SharedService,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    const _self = this;
    _self.userPost = new UserPosts();
    _self.postsList = new Array<object>();
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    const _self = this;
    _self.userPost = new UserPosts();
    _self.postsList = new Array<object>();
    _self.getPosts();
  }

  onSubmit($event) {
    const _self = this;
    $event.preventDefault();
    _self.formFirstSubmit = true;
    _self.formProcessing = true;
    _self.userPost.IsActive = true;
    _self.userPost.PostedBy = _self.config.loggedUserId;
    _self.userPost.PostedOn = new Date().toString();
    _self.userPost.PostedDate = moment()
      .format('L')
      .toString();
    _self.profileService.submitPost(_self.userPost).subscribe(
      data => {
        this.sharedService.getOnlineUsers().forEach(item => {
          _self.socketService.postComment({ id: item.id, text: _self.userPost.PostDescription });
        });
        _self.userPost = new UserPosts();
        setTimeout(() => {
          _self.formProcessing = false;
          _self.formFirstSubmit = false;
          _self.getPosts();
        }, 2000);
      },
      err => {
        console.log(err);
      }
    );
  }

  getPosts() {
    const _self = this;
    _self.profileService.getPosts(_self.config.loggedUserId).subscribe(
      data => {
        _self.postsList = _self.groupBy.transform(data.response, 'PostedDate');
      },
      err => {
        console.log(err);
      }
    );
  }

  deletePost(postId) {
    const _self = this;
    _self.localPostId = postId;
    _self.openModal('postDeleteConfirmation');
    // _self.profileService.deletePost(postId)
    //   .subscribe(
    //   data => {
    //     if (data.success) {
    //      _self.getPosts();
    //     }
    //   },
    //   err => {

    //   }
    //   )
  }
  confirmDelete() {
    const _self = this;
    _self.profileService.deletePost(_self.localPostId).subscribe(
      data => {
        if (data.success) {
          _self.getPosts();
          _self.closeModal('postDeleteConfirmation');
        }
      },
      err => { }
    );
  }
  openModal(id: string) {
    this.modalService.open(id);
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }

  showComments(p) {
    const divId = p._id;
    const dict = {};
    dict[divId] = true;
    this.isShowComments = dict;
  }
}
