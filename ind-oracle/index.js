"use strict";

const models = require('./build/script/models.js');
const oracle = require('./build/script/ind-oracle.js');

exports.IndOracle = oracle.IndOracle;
exports.GrantAccessData = models.GrantAccessData;
exports.GrantAccessRequest = models.GrantAccessRequest;
exports.GrantAccessResponse = models.GrantAccessResponse;