var Bicycle = artifacts.require("./Bicycle.sol");
const Web3 = require('web3');

module.exports = function(deployer) {

  const diesDasAnanas = Web3.utils.asciiToHex("to be defined");
  deployer.deploy(Bicycle, "KETTE Bicycle Register", "KBY", diesDasAnanas);
};
