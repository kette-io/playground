const contract = require('truffle-contract');

const ket_artifact = require('../build/contracts/Item.json');

var KetRegistry = contract(ket_artifact);

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

    mintKet: async function () {
      KetRegistry.setProvider(web3.currentProvider);

      if (typeof KetRegistry.currentProvider.sendAsync !== "function") {
        KetRegistry.currentProvider.sendAsync = function () {
          return KetRegistry.currentProvider.send.apply(KetRegistry.currentProvider, arguments);
        };
      }
      const ketRegistryInstance = await KetRegistry.deployed();

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      console.log(account);

      const config = ['0x000000000000000000000000000000000000000000000000000000006c8d3d89']
      const data = [];

      try {
        await ketRegistryInstance.mint(
          account,
          "0x7d255fc3491ee6b51191da315958b7d6a1e5b17904cc7683558f98acc57977b4",
          'url',
          "1e205550c271490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8",
          config,
          data,
          { from: account, gas: 300000 });

      } catch (e) {
        console.log("error");
        console.log(e);
      }
      const count = await ketRegistryInstance.balanceOf(accounts[0]);
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