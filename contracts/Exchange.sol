// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./DappToken.sol";
import "./DappTokenSale.sol";

contract Exchange {
    string public name = "Swap";
    DappToken public tokenContract;
    DappTokenSale public tokenSale;
    //100 tokens costs 1ETH
    uint public rate = 100;

    event Sold(
        address account,
        address tokenContract,
        uint256 amount,
        uint256 rate
    );

  /*  constructor(DappToken _dappToken)public{
        tokenContract = _dappToken;
      //  tokenSale = _dappTokenSale;
    }

   // DappTokenSale.buyTokens(){
        
 //   }
    function sellTokens(uint256 _amount) public {
        //przelicznik wymiany
        uint256 etherAmount = _amount/rate;
        //Wykonanie transferu
        DappToken.transferFrom(msg.sender,address(this), _amount);
    //    msg.sender.transfer(etherAmount);

        emit Sold(msg.sender, address(tokenContract), _amount, rate );
    }*/
    
}