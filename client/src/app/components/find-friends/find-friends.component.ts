import { Component, OnInit, Inject } from '@angular/core';
import { NgxCarousel, NgxCarouselStore } from 'ngx-carousel';
import * as _ from 'underscore';
import { APP_CONFIG } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { FriendsService } from '../../services/friends/friends.service';
import { SocketService } from '../../services/sockets/socket.service';
@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.css']
})
export class FindFriendsComponent implements OnInit {
  public carouselTileItems: Array<any>;
  public carouselTile: NgxCarousel;
  socket: SocketIOClient.Socket;
  constructor(
    private friendService: FriendsService,
    @Inject(APP_CONFIG) private appconfig: IAppConfig,
    private socketService: SocketService
  ) {
    this.getPeople();
    this.carouselTile = {
      grid: { xs: 2, sm: 3, md: 3, lg: 3, all: 0 },
      slide: 2,
      speed: 400,
      animation: 'lazy',
      point: {
        visible: false
      },
      load: 2,
      touch: true,
      easing: 'ease'
    };
  }

  ngOnInit() {}
  public carouselTileLoad(evt: any) {
    const len = this.carouselTileItems.length;
    if (len <= 30) {
      for (let i = len; i < len + 10; i++) {
        this.carouselTileItems.push(i);
      }
    }
  }

  public getPeople() {
    this.friendService.getPeople().subscribe(
      data => {
        this.carouselTileItems = data.response;
      },
      err => {

      }
    );
  }

  sendRequest(id: any) {
    this.socketService.sendFriendRequest(id);
  }

}
