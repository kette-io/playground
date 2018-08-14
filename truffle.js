const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '666'
    },
    rinkeby: {
       provider: function() {
          return new HDWalletProvider(config.mnemonic, "https://rinkeby.infura.io/v3/" + config.infuraKey, 1)
        },
        network_id: 4
      }  
  }
}
