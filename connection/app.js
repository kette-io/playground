const contract = require('truffle-contract');

const bicycle_artifact = require('../build/contracts/Bicycle.json');

var BicycleRegistry = contract(bicycle_artifact);

const users = require('../config.json').users;

const promisifyEvent = require('promisify-event');

module.exports = function (web3) {

  const app = {

    register: async function (frameNumber, receiver) {

      const receiverAddress = users.find(x => x.name === receiver).address;
      const tokenId = web3.utils.sha3(frameNumber);

      const bicycle_Registry_Instance = await makeInstance(BicycleRegistry, web3);

      var web3_Registry_Instance = new web3.eth.Contract(bicycle_Registry_Instance.abi, bicycle_Registry_Instance.address);

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0].toLowerCase();

      const config = [web3.utils.asciiToHex("does not expire")]
      const data = [];

      try {

        //we do not want to return the result of the send function
        // because the result of send is only available AFTER the transaction is mined.
        // Instead we just want to get the hash of the pending transaction.
        // An event is emmited ('transactionHash') as soon as the transaction hash is available.
        // For better readabilty we promisfy the event and can await it. WOW
        const hash = await promisifyEvent(
          web3_Registry_Instance.methods.mint(
            receiverAddress,
            tokenId,
            'url',
            frameNumber,
            config,
            data)
            .send({ from: account, gas: 300000 }),
          'transactionHash')

        /*
        console.log("before")
        const result = web3_Registry_Instance.methods.mint(
          receiverAddress,
          tokenId,
          'url',
          frameNumber, //not yet clear how to exactly create proof
          config,
          data).send({ from: account, gas: 300000 }).on('transactionHash', function(transactionHash){ return transactionHash });
        console.log("result:")

        const result = await bicycle_Registry_Instance.mint(
          receiverAddress,
          tokenId,
          'url',
          frameNumber, //not yet clear how to exactly create proof
          config,
          data,
          { from: account, gas: 300000 });
          */

        return hash;

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