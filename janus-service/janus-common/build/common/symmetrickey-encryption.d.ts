export declare class SymmetricKeyEncryption {
    private ALPHANUMERIC;
    randomSalt(len: number): string;
    generateSymKey(): string;
    encrypt(dataUtf8Text: string, key: string): string;
    decrypt(encryptedDataHex: string, key: string): string;
}
