import { Injectable, Inject } from '@angular/core';
import { Http, Headers,RequestOptions } from '@angular/http';
import { IAppConfig } from '../../config/iapp.config';
import { APP_CONFIG } from '../../config/app.config';
@Injectable()
export class TimelineService {

  constructor(
    private http: Http,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {

  }

  submitComment(comment) {
    const headers = new Headers();
    headers.append('Authorization', this.config.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.config.apiEndpoint + 'post/submitComment', comment, { headers: headers })
      .map(res => res.json());
  }

  submitChildComment(comment) {
    const headers = new Headers();
    headers.append('Authorization', this.config.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.config.apiEndpoint + 'post/submitChildComment', comment, { headers: headers })
      .map(res => res.json());
  }

  getComments(postId) {
    const reqOb = {
      parentpostid: postId
    };
    const headers = new Headers();
    headers.append('Authorization', this.config.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.config.apiEndpoint + 'post/getCommentsByPostId/' + postId, { headers: headers })
      .map(res => res.json());
  }
  

}
