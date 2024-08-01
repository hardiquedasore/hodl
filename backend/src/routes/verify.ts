import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import Web3 from 'web3';
import json from "../helper/json";

// truffle + web3 connection config
const ReportContract = require('../../build/contracts/ReportHandler.json'); 
const contractABI = ReportContract.abi; 
const contractAddress = process.env.CONTRACT_ADDRESS;
const rpcEndpoint = process.env.RPC_POINT;
const web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint)); 
const contract = new web3.eth.Contract(contractABI, contractAddress);

const router = express.Router();

router.post('/', async(req, res) => {
    try {
        // if you can make the frontend be able to collect the user's meta mask address 
        const { reportId } = req.body; // const { reportId, userAddress } = req.body
        const result = await contract.methods.verifyReport(reportId).send({ from:  "0xb9a930f06443143b4612766AD0241148756902E4" }) // .send({ from: userAddress })
        const resultJSONString = json(result)
        const resultData = JSON.parse(resultJSONString);
        res.status(200).json({ message: resultData});
    } catch(error) {
        res.status(500).json(error.message);
    }
    
})

router.post('/addVerifier', async (req, res) => {
    try {
        const { verifierAddress } = req.body;
        const accounts = await web3.eth.getAccounts();
        const manager = accounts[0];

        await contract.methods.addVerifier(verifierAddress).send({ from: manager });
        res.status(200).json({ message: "Verifier Added" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/removeVerifier', async (req, res) => {
    try {
        const { verifierAddress } = req.body;
        const accounts = await web3.eth.getAccounts();
        const manager = accounts[0];

        await contract.methods.removeVerifier(verifierAddress).send({ from: manager });
        res.status(200).json({ message: "Verifier Removed" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;