import { Type } from '@angular/core';

export class ProfileItem {
  constructor(public component: Type<any>,public componentName:string) {}
}