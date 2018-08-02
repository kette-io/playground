const contract = require('truffle-contract');

const metacoin_artifact = require('../build/contracts/MetaCoin.json');

const ket_artifact = require('../KetXcert.json');

var MetaCoin = contract(metacoin_artifact);
var KetRegistry = contract(ket_artifact);

module.exports = function (web3) {

  const app = {

    start: async function () {
      const accounts = await web3.eth.getAccounts();
      return accounts;
    },

    refreshBalance: async function (account) {

      try {
        const metaCoinInstance = await makeMetaCoinContractInstance(web3);
        const balance = await metaCoinInstance.getBalance.call(account, { from: account });
        return balance.valueOf();

      }
      catch (e) {
        console.log(e);
        return 0;
      }
    },

    sendCoin: async function (amount, sender, receiver) {
      const metaCoinInstance = await makeMetaCoinContractInstance(web3);
      await metaCoinInstance.sendCoin(receiver, amount, { from: sender })
      const newBalance = await this.refreshBalance(sender);
      return newBalance;
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

      const config = [ '0x000000000000000000000000000000000000000000000000000000006c8d3d89' ]
      const data = [];
      console.log("before");
      try {
        await ketRegistryInstance.mint(
          account, 
          "0x6d255fc3390ee6b41191da315958b7d6a1e5b17904cc7683558f98acc57977b4", 
          'url', 
          "1e205550c271490347e5e2393a02e94d284bbe9903f023ba098355b8d75974c8", 
          config, 
          data, 
          { from: account, gas: 4612388 });
        console.log("after");
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