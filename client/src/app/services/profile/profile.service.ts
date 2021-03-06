import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { IAppConfig } from '../../config/iapp.config';
import { APP_CONFIG } from '../../config/app.config';


@Injectable()
export class ProfileService {

  constructor(
    private http: Http,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {

  }

  submitPost(posts) {
    const headers = new Headers();
    headers.append('Authorization', this.config.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.config.apiEndpoint + 'post/submitPost', posts, { headers: headers })
      .map(res => res.json());
  }

  getPosts(userId) {
    const headers = new Headers();
    headers.append('Authorization', this.config.authToken);
    headers.append('Content-Type', 'application/json');

    // return this.http.get(this.config.apiEndpoint + 'post/getPostByPostedBy/' + userId, { headers: headers })
    //   .map(res => res.json());
    return this.http.get(this.config.apiEndpoint + 'post/get', { headers: headers })
    .map(res => res.json());
  }

  deletePost(postId) {
    const headers = new Headers();
    headers.append('Authorization', this.config.authToken);
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers, params: {  postId : postId } });
    return this.http.delete(this.config.apiEndpoint + 'post/deletePost', options)
      .map(res => res.json());
  }

  updateUser(user: any) {
    const headers = new Headers();
    headers.append('Authorization', this.config.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.config.apiEndpoint + 'post/updateUser', user, { headers: headers })
      .map(res => res.json());
  }
}
