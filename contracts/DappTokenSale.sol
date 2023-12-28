// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./DappToken.sol";
import "hardhat/console.sol";

contract DappTokenSale {
    address payable public admin;
    DappToken public tokenContract;
    uint256 public tokenPrice = 1000000000000000;
    uint256 public tokensSold;

    event Buy(
        address _buyer,
        uint256 _amount
    );
   
      event Sold(
        address account,
        address tokenContract,
        uint256 amount
      
    );

    constructor(DappToken _tokenContract, uint256 _tokenPrice) {
        //Assign an admin
        admin = payable(msg.sender);
        //Token Contract
        tokenContract = _tokenContract;

        //Token Price
        tokenPrice = _tokenPrice;
    }

    // buy tokens

    function buyTokens(uint256 _numberOfTokens) public payable {
        
   

        //require that value is equal to tokens
        require(
            msg.value == (_numberOfTokens * tokenPrice),
            "Incorrect value sent"
        );
        //require that contract has enought tokens
       
        require(
            tokenContract.balanceOf(address(this)) >= _numberOfTokens,
            "Not enough tokens available"
        );

        require(
            tokenContract.transfer(msg.sender, _numberOfTokens),
            "Token transfer failed"
        );
        //Keep track of tokenSold
        tokensSold += _numberOfTokens;
        //Trigger Sell event
        emit Buy(msg.sender, _numberOfTokens);
        // emit TokensPurchased(msg.sender, address(tokenContract), _numberOfTokens, tokenPrice);
    }

     
    function sellTokens(uint256 _amount) public payable{
        
         // nie można sprzedać więcej niż się ma
        require(tokenContract.balanceOf(msg.sender) >= _amount, "Insufficient token balance");
        
       
        
    // Require that Swap has enough Ether
    require(address(this).balance >= _amount, "Insufficient Ether balance");

        //Wykonanie transferu
       require(tokenContract.transferFrom(msg.sender,address(this), _amount),"Token transfer failed");
        //przelicznik wymiany
        uint256 etherAmount = _amount*tokenPrice;
        payable(msg.sender).transfer(etherAmount);
        tokensSold -= _amount;
        emit Sold(msg.sender, address(tokenContract), _amount );
    }


    //ending token sale
    function endSale() public payable {
        //require admin
        require(msg.sender == admin, "Only the admin can end the sale");
        //transfer remaining dapp tokens to admin
        require(
            tokenContract.transfer(
                admin,
                tokenContract.balanceOf(address(this))
            ),
            "Token transfer to admin failed"
        );
        //zwrot do admina reszty
        admin.transfer(address(this).balance);
    }

    receive() external payable {}

    fallback() external payable {}
}
