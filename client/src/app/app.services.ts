import { Injectable } from '@angular/core';
import { RouterModule, Routes,Router } from '@angular/router';
@Injectable()
export class AppService {

  constructor(public  router:Router) { 
  }
  getUrl()
  {
    return this.router.url;
  }
}