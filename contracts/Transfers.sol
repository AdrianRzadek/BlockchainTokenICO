// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./FossaToken.sol";

contract Transfers {
    uint256 public transfersCounter;
    FossaToken public tokenContract;

    constructor(FossaToken _tokenContract) {
        // Token Contract
        tokenContract = _tokenContract;
    }

    struct TransferStruct {
        address sender;
        address receiver;
        uint256 amount;
    }

    TransferStruct[] public transfers;

    function transfer(
        address payable _receiver,
        uint256 _amount
    ) public payable {
        transfersCounter += 1;

        // Add the transfer details to the transfers array
        transfers.push(TransferStruct(msg.sender, _receiver, _amount));

        // Ensure the token transfer is successful
        require(
            tokenContract.transferFrom(msg.sender, _receiver, _amount),
            "Token transfer failed"
        );
    }

  
    function getAllTransactions()
        public
        view
        returns (TransferStruct[] memory)
    {
        return transfers;
    }


    function getTransactionsCount() public view returns (uint256) {
        return transfersCounter;
    }

    // Fallback function to receive Ether
    receive() external payable {}

    // Fallback function to receive Ether
    fallback() external payable {}
}
