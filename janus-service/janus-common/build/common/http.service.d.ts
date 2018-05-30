import { IHttpService } from './ihttp.service';
export declare class HttpService implements IHttpService {
    RaiseHttpRequest(host: string, port: string, path: string, method: string, data: object, timeout?: number): Promise<any>;
    private httpRequest(params, postData);
}
