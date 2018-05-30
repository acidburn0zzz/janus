"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = require('http');
var HttpService = /** @class */ (function () {
    function HttpService() {
    }
    HttpService.prototype.RaiseHttpRequest = function (host, port, path, method, data, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonPaylod, post_options, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jsonPaylod = JSON.stringify(data);
                        console.log("jsonPaylod", jsonPaylod);
                        post_options = {
                            host: host,
                            port: port,
                            path: path,
                            method: method,
                            timeout: timeout || 120000,
                            headers: {
                                'Content-Type': 'application/json',
                                'Content-Length': Buffer.byteLength(jsonPaylod)
                            }
                        };
                        console.log("post_options", post_options);
                        return [4 /*yield*/, this.httpRequest(post_options, jsonPaylod)];
                    case 1:
                        response = _a.sent();
                        console.log("Http response", response);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    HttpService.prototype.httpRequest = function (params, postData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
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
                                }
                                catch (e) {
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
                    })];
            });
        });
    };
    return HttpService;
}());
exports.HttpService = HttpService;
//# sourceMappingURL=http.service.js.map