const contract = require("../config/contract");

exports.isAdmin = async (address) => {
  return await contract.methods.isAdmin(address).call();
};
