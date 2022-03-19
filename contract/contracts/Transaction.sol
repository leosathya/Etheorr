// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Transaction{
    uint256 transactionCount;

    event Transfer(address from, address to, uint amount, uint timestamp);

    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        uint timestamp;
    }

    TransferStruct[] transactions;

    constructor (){}

    function addToBlock(address payable _receiver, uint _amount) public {
        transactionCount ++;
        transactions.push(TransferStruct(msg.sender, _receiver, _amount, block.timestamp));

        emit Transfer(msg.sender, _receiver, _amount, block.timestamp);
    }

    function getAllTransactions() public view returns(TransferStruct[] memory){
        return transactions;
    }

    function getTransactionCount() public view returns(uint256) {
        return transactionCount;
    }
}