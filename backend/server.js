require('dotenv').config();
import express, { json } from 'express';
const app =express()
import routes from './routes';
import Web3, { providers } from 'web3';
import { MongoClient as mongodb } from 'mongodb';
import contract from 'truffle-contract';
import artifacts from './build/Inbox.json';

app.use(json())

if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider)
  } else {
    var web3 = new Web3(new providers.HttpProvider('https://localhost:8545'))
}

const LMS = contract(artifacts)
LMS.setProvider(web3.currentProvider)

mongodb.connect(process.env.DB,{ useUnifiedTopology: true }, async(err,client)=>{
    const db = client.db('Cluster0')
    const accounts = await web3.eth.getAccounts();
    const lms = await LMS.deployed();
    
    routes(app,db, lms, accounts)
    app.listen(process.env.PORT || 8082, () => {
       console.log('listening on port '+ (process.env.PORT || 8082));
    })
})
