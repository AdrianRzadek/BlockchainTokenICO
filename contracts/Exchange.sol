// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./DappToken.sol";
import "./DappTokenSale.sol";

contract Exchange {
    string public name = "Swap";
    DappToken public tokenContract;
    DappTokenSale public tokenSale;
    //1 tokens costs 1ETH
    uint public rate = 1;

    event Sold(
        address account,
        address tokenContract,
        uint256 amount,
        uint256 rate
    );

    constructor(DappToken _tokenContract){
        tokenContract = _tokenContract;

    }

 
    function sellTokens(uint256 _amount) public payable{
        //przelicznik wymiany
        uint256 etherAmount = _amount;
        //Wykonanie transferu
       require(tokenContract.transferFrom(msg.sender,address(this), _amount),"Token transfer failed");
         payable(msg.sender).transfer(etherAmount);

        emit Sold(msg.sender, address(tokenContract), _amount, rate );
    }
    
}