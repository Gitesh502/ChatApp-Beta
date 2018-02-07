import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { IAppConfig } from '../../config/iapp.config';
import { APP_CONFIG } from '../../config/app.config';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ChatService {
  constructor(
    private http: Http,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {}

  saveMessage(message) {
    const headers = new Headers();
    headers.append('Authorization', this.config.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.config.apiEndpoint + 'chat/save', message, { headers: headers })
      .map(res => res.json());
  }

  getMessages( to: string) {
    const headers = new Headers();
    headers.append('Authorization', this.config.authToken);
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers, params: {  toId: to } });
    return this.http.get(this.config.apiEndpoint + 'chat/getMessages', options)
      .map(res => res.json());
  }

  getChatId(to: string) {
    const headers = new Headers();
    headers.append('Authorization', this.config.authToken);
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers, params: { toId: to } });
    return this.http.get(this.config.apiEndpoint + 'chat/getChatId', options)
      .map(res => res.json());
  }

  getMessengers() {
    const headers = new Headers();
    headers.append('Authorization', this.config.authToken);
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers});
    return this.http.get(this.config.apiEndpoint + 'chat/getMessengers', options)
      .map(res => res.json());
  }


}
