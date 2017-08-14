import { Component, OnInit, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { IAppConfig } from '../../iapp.config';
import { APP_CONFIG } from '../../app.config';
import { ProfileService } from '../../services/profile/profile.service';
import { UserPosts, UserModel } from '../../models/profileModel';
import { GroupByPipe } from '../../pipes/group-by-pipe.pipe';
import * as moment from 'moment';
import { Lightbox } from 'angular2-lightbox';
import { DropzoneConfigInterface,DropzoneComponent,DropzoneDirective } from 'angular2-dropzone-wrapper';
//import { DropzoneComponent, DropzoneDirective, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [
    './profile.component.css',
    '../../../assets/css/animations.css',
    '../../../assets/css/reset.css'
  ],
  //encapsulation: ViewEncapsulation.None
  //encapsulation: ViewEncapsulation.Native
})
export class ProfileComponent implements OnInit {
  user: UserModel;
  userPost: UserPosts;
  postsList: Array<object>;
  formFirstSubmit: boolean = false;
  formProcessing: boolean = false;
  public type: string = 'component';
  public disabled: boolean = false;
  isNewKey: false;
  private profilePics: Array<object>;
  private album = {
    src: "",
    caption: "",
    thumb: ""
  };
  DropzoneConfigInterface
  public config: DropzoneConfigInterface = {
    
    maxFilesize: 50,
    acceptedFiles: 'image/*',
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
    headers:{"Authorization":this.appconfig.authToken},
    server: 'http://localhost:3000/images/uploadProfileImage',
  };

  @ViewChild(DropzoneComponent) componentRef: DropzoneComponent;
  @ViewChild(DropzoneDirective) directiveRef: DropzoneDirective;
  constructor(
    private accountService: AccountService,
    private profileService: ProfileService,
    private router: Router,
    @Inject(APP_CONFIG) private appconfig: IAppConfig,
    private groupBy: GroupByPipe,
    private lightbox: Lightbox
  ) {
    this.userPost = new UserPosts();
    this.user = new UserModel();
    this.postsList = new Array<object>();
  }

  ngOnInit() {
    this.accountService.getProfile()
      .subscribe(
      profile => {
        this.user = profile.response;
        this.user.id = profile.response._id;
        if (profile.response.profilePics) {
          this.album = {
            src: profile.response.profilePics[0].src,
            caption: "Test",
            thumb: profile.response.profilePics[0].src
          }
        }

        this.getPosts();
      },
      err => {
        console.log(err);
      }
      );
  }
  onSubmit($event) {
    $event.preventDefault();

    this.formFirstSubmit = true;
    this.formProcessing = true;

    this.userPost.IsActive = true;
    this.userPost.PostedBy = this.user.id;
    this.userPost.PostedOn = new Date().toString();
    this.userPost.PostedDate = moment().toString();

    this.profileService.submitPost(this.userPost)
      .subscribe(
      data => {
        this.userPost = new UserPosts();
        /* After 2 seconds, finish submitting */
        setTimeout(() => {
          this.formProcessing = false;
          this.getPosts();
        }, 2000);
      },
      err => {
        console.log(err);
      }
      );
  }

  getPosts() {
    this.profileService.getPosts(this.user.id)
      .subscribe(
      data => {
        this.postsList = this.groupBy.transform(data.response, "PostedDate");
        // console.log(this.postsList);
        // this.postsList=data.response;
      },
      err => {
        console.log(err);
      }
      )
  }

  // reset() {
  //   if (this.type === 'component') {
  //     this.componentRef.directiveRef.reset();
  //   } else {
  //     this.directiveRef.reset();
  //   }
  // }

  toggleType() {
    this.type = this.type == 'component' ? 'directive' : 'component';
  }

  toggleAutoReset() {
    this.config.autoReset = this.config.autoReset ? null : 5000;
    this.config.errorReset = this.config.errorReset ? null : 5000;
    this.config.cancelReset = this.config.cancelReset ? null : 5000;
  }

  toggleMultiUpload() {
    this.config.maxFiles = this.config.maxFiles ? null : 1;
  }

  toggleClickAction() {
    this.config.clickable = !this.config.clickable;
  }

  toggleDisabledState() {
    this.disabled = !this.disabled;
  }

  onUploadError(args: any) {
    console.log('onUploadError:', args);
  }

  onUploadSuccess(args: any) {
    console.log('onUploadSuccess:', args);
  }

  imageModalOnOpen() {
    
  }

  onProfileClick()
  {
    this.lightbox.open([this.album]);
  }
}
