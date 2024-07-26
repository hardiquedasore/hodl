var IPFSInbox = artifacts.require("./ReportHandler.sol");

export default function(deployer) {
    deployer.deploy(IPFSInbox);
};