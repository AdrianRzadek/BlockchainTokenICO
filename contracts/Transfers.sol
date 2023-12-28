// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;
import "./FossaToken.sol";

contract Transfers {
    uint256 TransfersCounter;
    FossaToken public tokenContract;

    constructor(FossaToken _tokenContract) {
        //Token Contract
        tokenContract = _tokenContract;
    }

    struct TransferStruct {
        address sender;
        address reciver;
        uint amount;
    }

    TransferStruct[] transfers;

    function sendTransaction(
        address payable reciver,
        uint amount
    ) public payable {
        TransfersCounter += 1;
        transfers.push(TransferStruct(msg.sender, reciver, amount));
        require(
            tokenContract.transferFrom(msg.sender, reciver, amount),
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
        return TransfersCounter;
    }

    receive() external payable {}

    fallback() external payable {}
}
