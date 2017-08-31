import { Component, OnInit,Inject } from '@angular/core';
import { IAppConfig } from '../../config/iapp.config';
import { APP_CONFIG } from '../../config/app.config';
import { SharedService } from '../../services/shared/shared.service';
@Component({
  selector: 'app-leftbar',
  templateUrl: './leftbar.component.html',
  styleUrls: ['./leftbar.component.css']
})
export class LeftbarComponent implements OnInit {
private profilePicPath:string="";
  constructor(
    @Inject(APP_CONFIG) private config: IAppConfig,
    private sharedService:SharedService
  ) { 
    if(sharedService.getLocalProfile()!=null && sharedService.getLocalProfile().profileImages!=null && sharedService.getLocalProfile().profileImages.length>0)
    this.profilePicPath = this.config.apiEndpoint + sharedService.getLocalProfile().profileImages[0].imagePath+"/"+sharedService.getLocalProfile().profileImages[0].iconName;
  }

  ngOnInit() {
  }

}
