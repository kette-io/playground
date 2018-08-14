const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const makeRegistryProxy = require('./connection/app.js');
const Web3 = require('web3');
const bodyParser = require('body-parser');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

/*
const accounts = require('./accounts.json');
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const provider = new HDWalletProvider([accounts.owner.privateKey], "http://localhost:8545");
const web3 = new Web3(provider);
*/

const registryProxy = makeRegistryProxy(web3);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.get('/users', async (req, res) => {

  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  const users = await registryProxy.getUsers();
  res.send(users);
});

app.post('/register', async (req, res) => {

  const frameNumber = req.body.frameNumber;
  const receiver = req.body.receiver; 
  
  const registrationResult = await registryProxy.register(frameNumber, receiver);
  res.send(registrationResult);

});

app.listen(port, () => {

  console.log("Express Listening at http://localhost:" + port);

});
