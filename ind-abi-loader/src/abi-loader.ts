import * as indCommon from 'ind-common'

var fs = require('fs');
var path_module = require('path');

export class Abiloader implements indCommon.AbiLoaderInterface {

    loadAbi(name: string) {

        let abi = "";
        let path = './abi/name' + '.json';

        if (fs.existsSync(path)) {

        fs.readFile(path, (err, data) => {
                if (err) throw err;

                abi = data;                
            });
        }
        return abi;
    }
}