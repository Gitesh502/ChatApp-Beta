import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { IAppConfig } from '../../iapp.config';
import { APP_CONFIG } from '../../app.config';

@Injectable()
export class ProfileService {

  constructor(
    private http: Http,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {

  }

  submitPost(posts) {
    let headers = new Headers();
    headers.append("Authorization", this.config.authToken);
    headers.append("Content-Type", "application/json");
    return this.http.post(this.config.apiEndpoint + "post/submitPost", posts, { headers: headers })
      .map(res => res.json());
  }

  getPosts(userId) {
    let headers = new Headers();
    headers.append("Authorization", this.config.authToken);
    headers.append("Content-Type", "application/json");
    return this.http.get(this.config.apiEndpoint + "post/getPostByPostedBy/" + userId, { headers: headers })
      .map(res => res.json());
  }

}
