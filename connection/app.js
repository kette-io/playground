const contract = require('truffle-contract');

const bicycle_artifact = require('../build/contracts/Bicycle.json');

var BicycleRegistry = contract(bicycle_artifact);

module.exports = function (web3) {

  const app = {

    start: async function () {
      const accounts = await web3.eth.getAccounts();
      return accounts;
    },

    refreshBalance: async function (account) {

      try {
        return "not implemented yet"
      }
      catch (e) {
        console.log(e);
        return 0;
      }
    },

    sendCoin: async function (id, sender, receiver) {
      return "not implemented";
    },

    mintKet: async function (tokenId, receiver) {
      BicycleRegistry.setProvider(web3.currentProvider);

      if (typeof BicycleRegistry.currentProvider.sendAsync !== "function") {
        BicycleRegistry.currentProvider.sendAsync = function () {
          return BicycleRegistry.currentProvider.send.apply(BicycleRegistry.currentProvider, arguments);
        };
      }
      const bicycle_Registry_Instance = await BicycleRegistry.deployed();

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      console.log(account);

      const config = ['0x000000000000000000000000000000000000000000000000000000006c8d3d89']
      const data = [];

      console.log(tokenId);
      console.log(receiver);
      try {
        await bicycle_Registry_Instance.mint(
          receiver,
          tokenId,
          'url',
          tokenId, //not yet clear how to exactly create proof
          config,
          data,
          { from: account, gas: 300000 });

      } catch (e) {
        console.log("error");
        console.log(e);
      }
      const count = await bicycle_Registry_Instance.balanceOf(receiver);
      console.log(count);
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