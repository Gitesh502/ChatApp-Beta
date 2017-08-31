import { Directive,ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appProfile]'
})
export class ProfileDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
