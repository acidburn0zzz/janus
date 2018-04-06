"use strict";

//var asym = require('./build/script/asymmetrickey-encryption.js');
//var constants = require('./build/script/constants.js');
const models = require('./build/script/models.js');
const oracle = require('./build/script/ind-oracle.js');
//var service = require('./build/script/smartcontract.service.js');
//var sym = require('./build/script/symmetrickey-encryption.js');

exports.IndOracle = oracle.IndOracle;
exports.GrantAccessData = models.GrantAccessData;
exports.GrantAccessRequest = models.GrantAccessRequest;
exports.GrantAccessResponse = models.GrantAccessResponse;