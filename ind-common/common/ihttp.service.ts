
export interface IHttpService {
    RaiseHttpRequest(host: string, port: string, path: string, method: string, data: object, timeout?: number): Promise<any>;
}
