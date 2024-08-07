/// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.21;

/// @title Edited contract to agree on the lunch venue
/// @author Kevin Mao

contract ReportHandler {
    struct Report {
        string vendorName;
        uint256 distance;
        uint256 diesel;
        uint256 electricity;
        uint256 transport;
        uint256 total;
        string reportHash; // this should be an ipfs hash of the report
        bool verified;
    }

    address manager;
    mapping(address => bool) public verifiers;

    mapping(uint256 => Report) public reports;
    uint256 public reportCount;

    constructor() {
        manager = msg.sender;
    }

    // Adds a report
    function addReport(
        string memory vendorName,
        uint256 distance,
        uint256 diesel,
        uint256 electricity,
        uint256 transport,
        uint256 total,
        string memory reportHash
    ) public returns (uint256 reportId) {
        reportId = reportCount;
        reports[reportId] = Report(vendorName, distance, diesel, electricity, transport, total, reportHash, false);
        reportCount++;
        return reportId;
    }

    // Verifies a report, only manager address can call
    function addVerifier(address verifer) public {
        if (msg.sender != manager) {
            revert CallerNotManager();
        }
        verifiers[verifer] = true;
    }

    // Removes a verifier, only manager address can call
    function removeVerifier(address verifier) public {
        if (msg.sender != manager) {
            revert CallerNotManager();
        }
        verifiers[verifier] = false;
    }

    // Verify a report, only verifier can call
    function verifyReport(uint256 reportId) public {
        if (reportId > reportCount) {
            revert ReportDoesNotExist();
        }
        if (verifiers[msg.sender] == false) {
            revert CallerNotVerifier();
        }
        reports[reportId].verified = true;
    }

    // Gets a report based off reportId
    function getReport(uint256 reportId) public view returns (Report memory) {
        if (reportId > reportCount) {
            revert ReportDoesNotExist();
        }
        return reports[reportId];
    }

    // Get the total number of reports
    function getReportsCount() public view returns (uint256) {
        return reportCount;
    }

    // Get all reports
    function getAllReports() public view returns (string[] memory) {
        string[] memory allReports = new string[](reportCount);
        for (uint256 i = 0; i < reportCount; i++) {
            allReports[i] = reports[i].reportHash;
        }
        return allReports;
    }

    error ReportDoesNotExist();
    error CallerNotManager();
    error CallerNotVerifier();
}
