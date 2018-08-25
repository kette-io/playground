const contract = require('truffle-contract');

const bicycle_artifact = require('../build/contracts/Bicycle.json');

var BicycleRegistry = contract(bicycle_artifact);

const users = require('../config.json').users;

module.exports = function (web3) {

  const app = {

    register: async function (frameNumber, receiver) {

      const receiverAddress = users.find(x => x.name === receiver).address;
      const tokenId = web3.utils.sha3(frameNumber);

       const bicycle_Registry_Instance = await makeInstance(BicycleRegistry, web3);

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0].toLowerCase();

      const config = [web3.utils.asciiToHex("does not expire")]
      const data = [];
      try {
        const result = await bicycle_Registry_Instance.mint(
          receiverAddress,
          tokenId,
          'url',
          frameNumber, //not yet clear how to exactly create proof
          config,
          data,
          { from: account, gas: 300000 });
        return result;

      } catch (e) {
        console.log("error");
        console.log(e);
        return false;
      }
    }
  }

  return app;
}

makeInstance = async (contract, web3) => {
  contract.setProvider(web3.currentProvider);

  if (typeof contract.currentProvider.sendAsync !== "function") {
    contract.currentProvider.sendAsync = function () {
      return contract.currentProvider.send.apply(contract.currentProvider, arguments);
    };
  }
  const instance = await contract.deployed();
  return instance;
}