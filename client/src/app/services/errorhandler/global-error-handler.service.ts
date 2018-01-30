import { ErrorHandler, Injectable,Injector } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { SpinnerService } from '../spinner/spinner.service';
import * as StackTrace from 'stacktrace-js';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector,private spinnerService:SpinnerService) { }
  handleError(error) {
    const location = this.injector.get(LocationStrategy);
    const message = error.message ? error.message : error.toString();
    const url = location instanceof PathLocationStrategy
      ? location.path() : '';
    // get the stack trace, lets grab the last 10 stacks only
    StackTrace.fromError(error).then(stackframes => {
      const stackString = stackframes
        .splice(0, 20)
        .map(function(sf) {
          return sf.toString();
        }).join('\n');
      // log on the server
      console.log(stackString);
      setTimeout(() => {
        this.spinnerService.hideAll();
      }, 1000);
    });
    throw error;
  }
}
