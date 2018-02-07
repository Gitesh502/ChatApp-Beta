import { Injectable } from '@angular/core';

@Injectable()
export class ScreenwidthService {
  currentScreenWidth: number = -1;
  constructor() {
    this.currentScreenWidth = window.screen.width;
  }

  IsExtraSmall(): Boolean {
    if (window.innerWidth < 768) {
      return true;
    }
    return false;
  }

  IsSmall(): Boolean {
    if (window.innerWidth >= 768 && window.innerWidth < 992) {
      return true;
    }
    return false;

  }

  IsMedium(): Boolean {
    if (window.innerWidth >= 992 && window.innerWidth < 1200) {
      return true;
    }
    return false;

  }

  IsLarge(): Boolean {
    if (window.innerWidth >= 1200) {
      return true;
    }
    return false;

  }

  getCurrentScreenWidth() {
    this.currentScreenWidth = window.innerWidth;
    return this.currentScreenWidth;
  }

}
