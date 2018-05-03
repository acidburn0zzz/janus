"use strict";

const models = require('./build/script/models.js');
const oracle = require('./build/script/ind-oracle.js');

exports.IndOracle = oracle.IndOracle;
exports.GrantAccessToContractData = models.GrantAccessToContractData;
exports.GrantAccessToContractRequest = models.GrantAccessToContractRequest;
exports.GrantAccessToContractResponse = models.GrantAccessToContractResponse;