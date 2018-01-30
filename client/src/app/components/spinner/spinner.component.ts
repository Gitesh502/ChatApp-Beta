import { Component, Input, OnInit,Output, EventEmitter, OnDestroy } from '@angular/core';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: "spinner",
  template:
  ` <div *ngIf="show" class='chatapp-spinner' style="text-align:center;padding:15px 0px 15px 0px">
          <img class="spinner-img" src="../assets/images/loaders/spinner2.gif" alt="spinner" height=15 width=15/>
      </div>
  `,
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit,OnDestroy {
@Input() name: string;
@Input() loadingImage: string;
@Input() group: string;
private isShowing = false;

  constructor(private spinnerService: SpinnerService) {
  }

  ngOnInit(): void {
    if (!this.loadingImage) {
      this.loadingImage="../assets/images/loaders/spinner2.gif";
    }
    if (!this.name) throw new Error("Spinner must have a 'name' attribute.");
    this.spinnerService._register(this);
  }

  ngOnDestroy(): void {
    this.spinnerService._unregister(this);
  }

  @Input()
  get show(): boolean {
    return this.isShowing;
  }

  @Output() showChange = new EventEmitter();

  set show(val: boolean) {
    this.isShowing = val;
    this.showChange.emit(this.isShowing);
  }
}
