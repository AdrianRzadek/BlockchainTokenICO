// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.21;

contract Transactions{

    uint256 TransactionCounter;

<<<<<<< Updated upstream
    event Transfer(address from, address reciver, uint amount, string message, uint256 timestamp);
=======

      constructor(DappToken _tokenContract) 
     {
    
        //Token Contract
        tokenContract = _tokenContract;
        
    }

    event Transfer(address from, address reciver, uint256 numberOfTokens, string message, uint256 timestamp);
>>>>>>> Stashed changes

    struct TransferStruct{
        address sender;
        address reciver;
        uint amount;
        string message;
        uint256 timestamp;
        
    }

        TransferStruct[] transactions;

        function sendTransaction(address payable reciver, uint amount, string memory message) public payable{
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

         receive() external payable {}

         fallback() external payable {}
}