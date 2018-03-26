const bitcore = require('bitcore-lib');

export class Utils {

    public bitcorePublicKey(privateKey: string) {
        var privKey = new bitcore.PrivateKey(privateKey.slice(2));
        var pubKey = new bitcore.PublicKey.fromPrivateKey(privKey);
        return pubKey.toString();
    }

    public writeFormattedMessage(header: string, message: any) {
        console.log("");
        console.log("===" + header + "===");
        console.log(message);
        console.log("=== END", header, "END===");
    }
}