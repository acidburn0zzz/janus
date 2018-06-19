export interface ISigner {
    sign(message:string): Promise<string>;
}