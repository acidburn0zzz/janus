export interface IMessageProvider {
    postMessage(from:string, to:string, message:string);
    watch(callback: (err, message) => void);
}