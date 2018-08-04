const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const make_truffle_connect = require('./connection/app.js');
const Web3 = require('web3');
const bodyParser = require('body-parser');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

/*
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const privKeys = ["xxx"]; // private keys
const provider = new HDWalletProvider(privKeys, "http://localhost:8545");
const web3 = new Web3(provider);
*/

const truffle_connect = make_truffle_connect(web3);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.get('/getAccounts', async (req, res) => {

  const accounts = await truffle_connect.start();
  res.send(accounts);
});

app.post('/getBalance', async (req, res) => {

  let currentAcount = req.body.account;
  const account_balance = await truffle_connect.refreshBalance(currentAcount);
  const all_accounts = await truffle_connect.start();

  const response = [account_balance, all_accounts]
  res.send(response)
});

app.post('/mintCoin', async (req, res) => {
  //console.log(req.body);

  const newBalance = await truffle_connect.mintKet();
  /*
  let amount = req.body.amount;
  let sender = req.body.sender;
  let receiver = req.body.receiver;
  */
  //const newBalance = await truffle_connect.sendCoin(amount, sender, receiver);
  res.send("lol");
});

app.listen(port, () => {

  console.log("Express Listening at http://localhost:" + port);

});
