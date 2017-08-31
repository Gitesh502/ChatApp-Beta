import { Directive,ElementRef } from '@angular/core';
import { TimelineService } from '../../services/timeline/timeline.service';

@Directive({
  selector: 'timeline'
})
export class TimelineDirective {

  constructor(private element:ElementRef,private timelineService:TimelineService) {
    console.log(element.nativeElement)
   }
  show()
  {
    this.element.nativeElement.style.display="block";
  }

  hide()
  {
    this.element.nativeElement.style.display="hide";
  }
}
