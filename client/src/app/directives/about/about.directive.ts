import { Directive,ElementRef } from '@angular/core';

@Directive({
  selector: 'about'
})
export class AboutDirective {

  constructor(private element:ElementRef) { }

  

}
