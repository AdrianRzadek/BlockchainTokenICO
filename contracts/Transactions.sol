// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.21;

contract Transactions{

    uint256 TransactionCounter;

    event Transfer(address from, address reciver, uint amount, string message, uint256 timestamp);

    struct TransferStruct{
        address sender;
        address reciver;
        uint amount;
        string message;
        uint256 timestamp;
        
    }

        TransferStruct[] transactions;

        function addToBlockchain(address payable reciver, uint amount, string memory message) public {
            TransactionCounter += 1;
            transactions.push(TransferStruct(msg.sender, reciver, amount, message, block.timestamp));

            emit Transfer(msg.sender, reciver,amount, message, block.timestamp);
        }

         function getAllTransactions() public view returns (TransferStruct[] memory){
            return transactions;
        }

         function getTransactionsCount() public view returns (uint256) {
            return TransactionCounter;
        }
}