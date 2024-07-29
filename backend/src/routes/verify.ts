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
        const { reportId } = req.body;
        const result = await contract.methods.verifyReport(reportId).call()
        res.status(200).json({ message: "Report Verified" });
    } catch(error) {
        res.status(500).json(error.message);
    }
})

export default router;