// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Test, console2} from "forge-std/Test.sol";
import {ReportHandler} from "../src/ReportHandler.sol";

contract ReportHandlerTest is Test {
    ReportHandler public reportHandler;
    address public manager = address(this);
    address public verifier1 = address(0x1);
    address public verifier2 = address(0x2);

    function setUp() public {
        reportHandler = new ReportHandler();
    }

    function testAddReport() public {
        uint256 reportId = reportHandler.addReport("Vendor A", 100, 200, "Product A", "ipfsHash");
        assertEq(reportId, 0);

        ReportHandler.Report memory report = reportHandler.getReport(0);
        assertEq(report.vendorName, "Vendor A");
        assertEq(report.distance, 100);
        assertEq(report.emmissions, 200);
        assertEq(report.productType, "Product A");
        assertEq(report.reportHash, "ipfsHash");
        assertEq(report.verified, false);
    }

    function testOnlyManagerCanAddVerifiers() public {
        vm.prank(verifier1);
        vm.expectRevert("CallerNotManager");
        reportHandler.addVerifers(verifier1);

        reportHandler.addVerifers(verifier1);
        assertEq(reportHandler.verifiers(verifier1), true);
    }

    function testOnlyManagerCanRemoveVerifiers() public {
        reportHandler.addVerifers(verifier1);

        vm.prank(verifier1);
        vm.expectRevert("CallerNotManager");
        reportHandler.removeVerifier(verifier1);

        reportHandler.removeVerifier(verifier1);
        assertEq(reportHandler.verifiers(verifier1), false);
    }

    function testOnlyVerifierCanVerifyReports() public {
        reportHandler.addReport("Vendor A", 100, 200, "Product A", "ipfsHash");

        vm.expectRevert("CallerNotVerifier");
        reportHandler.verifyReport(0);

        reportHandler.addVerifers(verifier1);
        vm.prank(verifier1);
        reportHandler.verifyReport(0);

        ReportHandler.Report memory report = reportHandler.getReport(0);
        assertEq(report.verified, true);
    }

    function testVerifyReportRevertsIfReportDoesNotExist() public {
        vm.expectRevert("ReportDoesNotExist");
        reportHandler.verifyReport(1);
    }

    function testGetReportRevertsIfReportDoesNotExist() public {
        vm.expectRevert("ReportDoesNotExist");
        reportHandler.getReport(1);
    }

    function testGetReportsCount() public {
        assertEq(reportHandler.getReportsCount(), 0);

        reportHandler.addReport("Vendor A", 100, 200, "Product A", "ipfsHash");
        assertEq(reportHandler.getReportsCount(), 1);
    }
}
