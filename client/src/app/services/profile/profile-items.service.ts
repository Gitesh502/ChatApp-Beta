import { Injectable } from '@angular/core';
import {ProfileItem} from '../../models/profileItem';
import { AboutComponent } from '../../components/about/about.component';
import { TimelineComponent } from '../../components/timeline/timeline.component';
@Injectable()
export class ProfileItemsService {

  constructor() { }
  getComponents()
  {
    return [
      new ProfileItem(TimelineComponent,"timeline"),
      new ProfileItem(AboutComponent,"about"),
    ];
  }
}
