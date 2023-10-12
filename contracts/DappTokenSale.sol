// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DappToken.sol";

contract DappTokenSale {

    address payable public  admin;
    DappToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold; 

    event Sell(address _buyer, uint256 _amount);

    constructor(address _tokenAddress, uint256 _tokenPrice) 
     {
        
        //Assign an admin
        admin = payable(msg.sender);
        //Token Contract
        tokenContract = DappToken(_tokenAddress);
        
        //Token Price
        tokenPrice = _tokenPrice;
         
    }


    function approveSpending(uint256 _value) public {
    require(tokenContract.approve(address(this), _value), "Approval failed");
    }


    // buy tokens

    function buyTokens(uint256 _numberOfTokens)external payable{
      
      
       //require that value is equal to tokens
      
       require(msg.value == (_numberOfTokens * tokenPrice), "Incorrect value sent");
       //require that contract has enought tokens
       //require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, "Not enough tokens available");
       //require that a transfer is successful
      // require(tokenContract.transfer(msg.sender, _numberOfTokens), "Token transfer failed");
        //Keep track of tokenSold
        tokensSold += _numberOfTokens;
        //Trigger Sell event
        emit Sell(msg.sender, _numberOfTokens);

    }

        


    //ending token sale
    function endSale() public payable {
        //require admin
        require(msg.sender == admin);
        //transfer remaining dapp tokens to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        //zwrot do admina reszty
         admin.transfer(address(this).balance);
    }
}
