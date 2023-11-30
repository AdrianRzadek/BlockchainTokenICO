// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.22;
import "./DappToken.sol";

contract Transactions{

    uint256 TransactionCounter;
    DappToken public tokenContract;

      constructor(DappToken _tokenContract) 
     {
    
        //Token Contract
        tokenContract = _tokenContract;
        
    }

   

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
            require(tokenContract.transferFrom(msg.sender, reciver, amount), "Token transfer failed");
  
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