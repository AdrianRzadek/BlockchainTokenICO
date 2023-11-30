// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.21;
import "./DappToken.sol";

contract Transactions{


    DappToken public tokenContract;
    uint256 TransactionCounter;

    event Transfer(address from, address reciver, uint256 numberOfTokens, string message, uint256 timestamp);

    struct TransferStruct{
        address sender;
        address reciver;
        uint256 numberOfTokens;
        string message;
        uint256 timestamp;
        
    }

        TransferStruct[] transactions;

        function sendTransaction(address payable reciver, uint256 numberOfTokens, string memory message) public payable{
            TransactionCounter += 1;
            // require(tokenContract.balanceOf(address(this)) >= numberOfTokens, "Not enough tokens available");

            transactions.push(TransferStruct(msg.sender, reciver, numberOfTokens, message, block.timestamp));

            emit Transfer(msg.sender, reciver,numberOfTokens, message, block.timestamp);
        }

         function getAllTransactions() public view returns (TransferStruct[] memory){
            return transactions;
        }

         function getTransactionsCount() public view returns (uint256) {
            return TransactionCounter;
        }
}