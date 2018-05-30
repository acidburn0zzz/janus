var crypto = require('crypto');
const cipher = crypto.createCipher('aes256', 'a password');

var algorithm = 'aes256';
var inputEncoding = 'utf8';
var outputEncoding = 'hex';

export class SymmetricKeyEncryption {
  private ALPHANUMERIC: string = "-ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_";

  randomSalt(len: number): string {
    var s = "";
    for (var i = 0; i < len; i++) {
      var index = Math.floor(Math.random() * 64);
      s = s + this.ALPHANUMERIC.substring(index, index + 1);
    }
    return s;
  }

  generateSymKey(): string {
    return this.randomSalt(128);
  }

  encrypt(dataUtf8Text: string, key: string) : string {
    var cipher = crypto.createCipher(algorithm, key);
    var ciphered = cipher.update(dataUtf8Text, inputEncoding, outputEncoding);
    ciphered += cipher.final(outputEncoding);
    return ciphered;
  }

  decrypt(encryptedDataHex: string, key: string): string {
    var decipher = crypto.createDecipher(algorithm, key);
    var finalData = decipher.update(encryptedDataHex, outputEncoding, inputEncoding);
    finalData += decipher.final(inputEncoding);
    return finalData;
  }

}