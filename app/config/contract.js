// file: app/config/contract.js
require("dotenv").config();

const web3 = require("./web3");
const abi = require("../../build/contracts/MedicalRecordSystem.json").abi;

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

module.exports = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
