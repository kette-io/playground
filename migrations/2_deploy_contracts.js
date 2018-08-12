var Bicycle = artifacts.require("./Bicycle.sol");

module.exports = function(deployer) {
  deployer.deploy(Bicycle, "KETTE Bicycle Register", "KBY", "to be defined");
};
