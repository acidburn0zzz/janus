"use strict";

//var asym = require('./build/script/asymmetrickey-encryption.js');
//var constants = require('./build/script/constants.js');
const models = require('./build/script/models.js');
const oracle = require('./build/script/ind-oracle.js');
//var service = require('./build/script/smartcontract.service.js');
//var sym = require('./build/script/symmetrickey-encryption.js');

exports.IndOracle = oracle.IndOracle;
exports.Party = models.Party;
exports.PartyType = models.PartyType;
exports.TransactionData = models.TransactionData;
exports.RegistrationData = models.RegistrationData;
exports.UnRegistrationData = models.UnRegistrationData;
exports.GrantAccessData = models.GrantAccessData;
exports.CreateTransactionRequest = models.CreateTransactionRequest;
exports.CreateTransactionResponse = models.CreateTransactionResponse;
exports.WalletRegistrationRequest = models.WalletRegistrationRequest;
exports.WalletRegistrationResponse = models.WalletRegistrationResponse;
exports.WalletUnRegistrationRequest = models.WalletUnRegistrationRequest;
exports.WalletUnRegistrationResponse = models.WalletUnRegistrationResponse;
exports.GrantAccessRequest = models.GrantAccessRequest;
exports.GrantAccessResponse = models.GrantAccessResponse;