export declare class AsymmetricKeyEncryption {
    bitcorePublicKey(privateKey: string): any;
    encrypt(dataUtf8Text: string, bitcorePublicKey: string): any;
    decrypt(encryptedDataHex: any, privateKey: string): any;
}
