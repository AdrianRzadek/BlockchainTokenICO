// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.21;

contract Transactions{

    uint256 TransactionCounter;

    event Transfer(address from, address reciver, uint amount, string message, uint256 timestamp, string keyword);

    struct TransferStruct{
        address sender;
        address reciver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

        TransferStruct[] transactions;

        function addToBlockchain(address payable reciver, uint amount, string memory message, string memory keyword ) public {
            TransactionCounter += 1;
            transactions.push(TransferStruct(msg.sender, reciver, amount, message, block.timestamp, keyword));

            emit Transfer(msg.sender, reciver,amount, message, block.timestamp, keyword);
        }

         function getAllTransactions() public view returns (TransferStruct[] memory){
            return transactions;
        }

         function getTransactionsCount() public view returns (uint256) {
            return TransactionCounter;
        }
}