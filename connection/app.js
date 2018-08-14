const contract = require('truffle-contract');

const bicycle_artifact = require('../build/contracts/Bicycle.json');

var BicycleRegistry = contract(bicycle_artifact);

const users = require('../accounts.json').users

module.exports = function (web3) {

  const app = {

    getUsers: async function () {
      return users.map(x => x.name);
    },

    register: async function (frameNumber, receiver) {

      const receiverAddress = users.find(x => x.name === receiver).address;
      const tokenId = web3.utils.sha3(frameNumber);

      BicycleRegistry.setProvider(web3.currentProvider);

      if (typeof BicycleRegistry.currentProvider.sendAsync !== "function") {
        BicycleRegistry.currentProvider.sendAsync = function () {
          return BicycleRegistry.currentProvider.send.apply(BicycleRegistry.currentProvider, arguments);
        };
      }
      const bicycle_Registry_Instance = await BicycleRegistry.deployed();

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const config = ['does not expire']
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

makeMetaCoinContractInstance = async (web3) => {
  MetaCoin.setProvider(web3.currentProvider);

  if (typeof MetaCoin.currentProvider.sendAsync !== "function") {
    MetaCoin.currentProvider.sendAsync = function () {
      return MetaCoin.currentProvider.send.apply(MetaCoin.currentProvider, arguments);
    };
  }
  const metaCoinInstance = await MetaCoin.deployed();
  return metaCoinInstance;
}