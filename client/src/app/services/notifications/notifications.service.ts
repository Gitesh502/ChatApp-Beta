import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { IAppConfig } from '../../config/iapp.config';
import { APP_CONFIG } from '../../config/app.config';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class NotificationsService {
  headers = new Headers();
  constructor(private http: Http, @Inject(APP_CONFIG) private config: IAppConfig) {

  }

  saveNotification(newNoti: any): Observable<any> {
  return  Observable.create(observer => {
      this.headers = new Headers();
      this.headers.append('Authorization', this.config.authToken);
      this.headers.append('Content-Type', 'application/json');
       this.http.post(this.config.apiEndpoint + 'notifications/save', newNoti, { headers: this.headers })
        .finally(observer.complete())
        .subscribe(
        data => observer.next(data),
        err => observer.error(err));
    });
  }

  updateNotification(newNoti: any): Observable<any> {
  return  Observable.create(observer => {
      this.headers = new Headers();
      this.headers.append('Authorization', this.config.authToken);
      this.headers.append('Content-Type', 'application/json');
       this.http.post(this.config.apiEndpoint + 'notifications/update', newNoti, { headers: this.headers })
        .finally(observer.complete())
        .subscribe(
        data => observer.next(data),
        err => observer.error(err));
    });
  }

  getNotifications()
  {
    this.headers = new Headers();
    this.headers.append('Authorization', this.config.authToken);
    this.headers.append('Content-Type', 'application/json');
    return this.http.get(this.config.apiEndpoint + 'notifications/getFCount', { headers: this.headers })
      .map(res=>res.json());
  }

}
