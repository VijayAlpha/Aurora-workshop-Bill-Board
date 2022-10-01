// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract BillBoard {

    struct BillStruct {
        address sender;
        string message;
        uint256 timestamp;
    }

    BillStruct[] bills;

    function addToBlockchain(string memory message) public {

        bills.push(BillStruct(msg.sender, message, block.timestamp));

    }

    function getAllTransactions() public view returns (BillStruct[] memory) {
        return bills;
    }
}