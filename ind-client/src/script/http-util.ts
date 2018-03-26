var http = require('http');

export class HttpUtil {
    public static async RaiseHttpRequest(host: string, port: string, path: string, method: string, data: object): Promise<any> {
        var jsonPaylod = JSON.stringify(data);
        console.log("jsonPaylod", jsonPaylod);

        // An object of options to indicate where to post to
        var post_options = {
            host: host, 
            port: port, 
            path: path, 
            method: method, 
            timeout: 120000,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonPaylod)
            }
        };
        console.log("post_options", post_options);
        // send the request
        var response: any = await this.httpRequest(post_options, jsonPaylod);
        console.log("Http response", response);
        return response;
    }

    private static async httpRequest(params, postData) {
        return new Promise(function (resolve, reject) {
        var req = http.request(params, function (res) {
            // reject on bad status
            if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error('statusCode=' + res.statusCode));
            }
            // cumulate data
            var body = [];
            res.on('data', function (chunk) {
            body.push(chunk);
            });
            // resolve on end
            res.on('end', function () {
            try {
                body = JSON.parse(Buffer.concat(body).toString());
            } catch (e) {
                console.log(new Date(), "Error", e);
                reject(e);
            }
            resolve(body);
            });
        });
        // reject on request error
        req.on('error', function (err) {
            // This is not a "Second reject", just a different sort of failure
            reject(err);
        });
        if (postData) {
            req.write(postData);
        }
        // IMPORTANT
        req.end();
        });
    }
}

