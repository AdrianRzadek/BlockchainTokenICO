// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./DappToken";
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

    constructor(DappToken _dappToken, DappTokenSale _dappTokenSale )public{
        dapptoken = _dappToken;
        dapptokensale = _dappTokenSale;
    }

    DappTokenSale.buyTokens(){
        
    }
    function sellTokens(uint256 _amount){
        //przelicznik wymiany
        uint256 etherAmount = _amount/rate;
        //Wykonanie transferu
        dapptoken.transferFrom(msg.sender,address(this), _amount)
        msg.sender.transfer(etherAmount);

        emit Sold(msg.sender, address(token), _amount, rate );
    }
    
}