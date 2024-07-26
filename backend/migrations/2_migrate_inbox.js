var IPFSInbox = artifacts.require("./ReportHandler.sol");

module.exports = function(deployer) {
    deployer.deploy(IPFSInbox);
};
