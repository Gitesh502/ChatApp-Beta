import * as moment from 'moment';
import * as _ from 'underscore';
import { APP_CONFIG } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { GroupByPipe } from '../../pipes/group-by-pipe.pipe';
import { UserPosts, UserModel } from '../../models/profileModel';
import { ProfileService } from '../../services/profile/profile.service';
import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})

export class TimelineComponent implements OnInit, AfterViewInit {
  public formFirstSubmit: boolean = false;
  public formProcessing: boolean = false;
  public userPost: UserPosts;
  public postsList: Array<object>;
  public currentUrl: string = window.location.href;
  private localPostId:string="";
  constructor(
    private groupBy: GroupByPipe,
    private profileService: ProfileService,
    private modalService:ModalService,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    var _self = this;
    _self.userPost = new UserPosts();
    _self.postsList = new Array<object>();

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    var _self = this;
    _self.userPost = new UserPosts();
    _self.postsList = new Array<object>();
    _self.getPosts();
  }

  onSubmit($event) {
    var _self = this;
    $event.preventDefault();
    _self.formFirstSubmit = true;
    _self.formProcessing = true;
    _self.userPost.IsActive = true;
    _self.userPost.PostedBy = _self.config.loggedUserId;
    _self.userPost.PostedOn = new Date().toString();
    _self.userPost.PostedDate = moment().format("L").toString();
    _self.profileService.submitPost(_self.userPost)
      .subscribe(
      data => {
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
    var _self = this;
    _self.profileService.getPosts(_self.config.loggedUserId)
      .subscribe(
      data => {
        _self.postsList = _self.groupBy.transform(data.response, "PostedDate");
      },
      err => {
        console.log(err);
      }
      )
  }

  deletePost(postId) {
    var _self = this;
    _self.localPostId=postId;
    _self.openModal("postDeleteConfirmation");
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
  confirmDelete()
  {
    var _self = this;
    _self.profileService.deletePost(_self.localPostId)
      .subscribe(
      data => {
        if (data.success) {
         _self.getPosts();
         _self.closeModal("postDeleteConfirmation");
        }
      },
      err => {

      }
      )
  }
  openModal(id: string) {
    this.modalService.open(id);
  }
  closeModal(id: string){
    this.modalService.close(id);
  }
}
