import { OpaqueToken } from "@angular/core";
import { IAppConfig } from './iapp.config';
export const APP_CONFIG = new OpaqueToken("app.config");

export const AppConfig: IAppConfig = {    
    apiEndpoint: "http://localhost:3000/" ,
    rootUrl:"http://localhost:4200/",
    authToken:"",
    loggedUser:null
};