import * as $ from 'jquery';
import * as _ from 'underscore';
import * as moment from 'moment';
import { Router } from '@angular/router';
//import { Lightbox } from 'angular2-lightbox';
import { APP_CONFIG } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { ProfileItem } from '../../models/profileItem';
import { ModalService } from '../../services/modal/modal.service';
import { GroupByPipe } from '../../pipes/group-by-pipe.pipe';
import { AccountService } from '../../services/account/account.service';
import { UserPosts, UserModel } from '../../models/profileModel';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { ProfileService } from '../../services/profile/profile.service';
import { ProfileItemsService } from '../../services/profile/profile-items.service';
import { ProfileDirective } from '../../directives/profile/profile.directive';
import { Component, OnInit, ViewEncapsulation, EventEmitter, Inject, ViewChild, ComponentFactoryResolver, OnDestroy, AfterViewInit } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls:
  [
    './profile.component.css',
    '../../../assets/css/animations.css',
    '../../../assets/css/reset.css'
  ],
  encapsulation: ViewEncapsulation.Emulated,
})

export class ProfileComponent implements OnInit, AfterViewInit {
  //gloabl variables
  public URL: string = 'http://localhost:3000/images/uploadProfileImage';
  public user: UserModel;
  public type: string = 'component';
  public disabled: boolean = false;
  public profilePicPath: string = "";
  public coverPicPath: string = "";
  public formData: FormData;
  public files: UploadFile[];
  public uploadInput: EventEmitter<UploadInput>;
  public humanizeBytes: Function;
  public dragOver: boolean;
  public curretnTab = {
    isTimeLine: true,
    isAbout: false,
    isFriends: false,
    isPhotos: false
  };
  profileItems: ProfileItem[];
  @ViewChild(ProfileDirective) adHost: ProfileDirective;


  constructor
    (
    private router: Router,
    //private lightbox: Lightbox,
    private groupBy: GroupByPipe,
    private modalService: ModalService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private profileItemsService: ProfileItemsService,
    @Inject(APP_CONFIG) private appconfig: IAppConfig,
    private componentFactoryResolver: ComponentFactoryResolver
    ) {
    this.profilePicPath = "";
    this.user = new UserModel();
    this.user.profileImages = new Array();
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    this.curretnTab = {
      isTimeLine: true,
      isAbout: false,
      isFriends: false,
      isPhotos: false
    };
  }

  ngOnInit() {

    this.getComponents();
    this.initProfileUploader();
    this.initprofileAccordians();
    this.getProfile();


  }

  ngAfterViewInit() {
    setTimeout(() => {
      let comp = _.findWhere(this.profileItems, { componentName: "timeline" });
      this.loadComponent(comp.component);
    }, 100);
  }

  loadComponent(coponent) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(coponent);
    let viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);

  }

  getComponents() {
    this.profileItems = this.profileItemsService.getComponents();
  }

  initTimeLineUploader() {
    this.URL = "http://localhost:3000/images/uploadCoverImage"
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.URL,
      method: 'POST',
      headers: { "Authorization": this.appconfig.authToken }
    };
    this.uploadInput.emit(event);
  }

  initProfileUploader() {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.URL,
      method: 'POST',
      headers: { "Authorization": this.appconfig.authToken }
    };
    this.uploadInput.emit(event);
  }

  getProfile() {
    this.accountService.getProfile()
      .subscribe(
      profile => {
        this.user = profile.response;
        this.user.id = profile.response._id;
        if (profile.response.profileImages) {
          if (profile.response != null) {
            if (profile.response.profileImages != null && profile.response.profileImages.length > 0)
              this.profilePicPath = this.appconfig.apiEndpoint + profile.response.profileImages[0].fullPath;
            if (profile.response.coverImages != null && profile.response.coverImages.length > 0)
              this.coverPicPath = this.appconfig.apiEndpoint + profile.response.coverImages[0].fullPath;
          }
        }
      },
      err => {
      throw new Error(err);
      }
      );
  }

  initprofileAccordians() {
    var Accordion = function(el, multiple) {
      this.el = el || {};
      this.multiple = multiple || false;
      // Variables privadas
      var links = this.el.find('.link');
      // Evento
      links.on('click', { el: this.el, multiple: this.multiple }, this.dropdown)
    }
    Accordion.prototype.dropdown = function(e) {
      var $el = e.data.el;
      var $this = $(this);
      var $next = $this.next();
      $next.slideToggle();
      $this.parent().toggleClass('open');
      if (!e.data.multiple) {
        $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
      };
    }
    var accordion = new Accordion($('#accordion'), false);

  }
  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  onUploadOutput(output: UploadOutput, type: string): void {

    if (output.type === 'allAddedToQueue') {
      if (type == "cover")
        this.initTimeLineUploader();
      else
        this.initProfileUploader();
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type == "done") {
      if (type == "cover")
        this.coverPicPath = this.appconfig.apiEndpoint + output.file.response.response;
      else
        this.profilePicPath = this.appconfig.apiEndpoint + output.file.response.response;
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

  loadAbout(event) {
    event.stopPropagation();
    let comp = _.findWhere(this.profileItems, { componentName: "about" });
    this.loadComponent(comp.component);
  }
  loadTimeline(event) {
    let comp = _.findWhere(this.profileItems, { componentName: "timeline" });
    this.loadComponent(comp.component);
  }
}
