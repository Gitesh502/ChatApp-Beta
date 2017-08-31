import { SocketIoConfig } from 'ng-socket-io';

export declare class SocketIOConfig implements SocketIoConfig {
    url:string;
    options?:any;
    constructor(config?: SocketIoConfig);
    assign(config?: SocketIoConfig): void;
}