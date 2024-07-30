import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import Web3 from 'web3';
import json from "../helper/json";
import axios from 'axios';
import calculate_total from '../helper/report';

// truffle + web3 connection config
const ReportContract = require('../../build/contracts/ReportHandler.json'); 
const contractABI = ReportContract.abi; 
const contractAddress = process.env.CONTRACT_ADDRESS;
const rpcEndpoint = process.env.RPC_POINT;
const web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint)); 
const contract = new web3.eth.Contract(contractABI, contractAddress);

const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({ pinataJWTKey: process.env.PIN_KEY })

const router = express.Router();


router.get('/all', async (req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const manager = accounts[0];

        const count = await contract.methods.getReportsCount().call();
        const countJSONString = json(count)
        const countData = JSON.parse(countJSONString);
        res.json({ countData });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/:id', async(req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const manager = accounts[0];

        const id = req.params.id;
        const report = await contract.methods.getReport(id).call();
        const reportJsonString = json(report)
        const reportData = JSON.parse(reportJsonString);
        const ipfsHash = reportData.reportHash;

        const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
        const reportJsonData = response.data;

        res.json({ 
            report: reportJsonData,
            verfied: reportData.verified
         });

    } catch(error) {
        res.status(500).send(error.message);
    }
});

router.post('/add', async (req, res) => {
    try {
        const { vendorName, distance, diesel, electricity, transport } = req.body;
        const accounts = await web3.eth.getAccounts();
        const reportJson = {
            vendorName: vendorName,
            distance: distance,
            diesel: diesel,
            electricity: electricity,
            transport: transport,
            total: calculate_total(diesel, electricity, transport),
        }
        const pinataRes = await pinata.pinJSONToIPFS(reportJson)

        const gasEstimateBigInt = await contract.methods.addReport(
            vendorName,
            distance,
            diesel,
            electricity,
            transport,
            Math.round( calculate_total(diesel, electricity, transport) ),
            pinataRes.IpfsHash
        ).estimateGas({ from: accounts[0] });

        const gasEstimate = gasEstimateBigInt.toString();

        const result = await contract.methods.addReport(
            vendorName,
            distance,
            diesel,
            electricity,
            transport,
            Math.round( calculate_total(diesel, electricity, transport) ),
            pinataRes.IpfsHash
        ).send({ from: accounts[0], gas: gasEstimate });

        console.log('Transaction result:', result );

        res.json(json(result));
    } catch (error) {
        res.status(500).send(error.message);
    }
});



export default router;