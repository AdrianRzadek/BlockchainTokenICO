// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./DappToken.sol";
import "hardhat/console.sol";

contract DappTokenSale {
    address payable public admin;
    DappToken public tokenContract;
    uint256 public tokenPrice = 1000000000000000;
    uint256 public tokensSold;
   uint256 public rate = 100;

    event Sell(
        address _buyer,
      
        uint256 _amount
        
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
        
      //  uint256 tokenAmount = msg.value * rate;

        //require that value is equal to tokens
        require(
            msg.value == (_numberOfTokens * tokenPrice),
            "Incorrect value sent"
        );
        //require that contract has enought tokens
        console.log(tokenContract.balanceOf(address(this)));
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
        emit Sell(msg.sender, _numberOfTokens);
        // emit TokensPurchased(msg.sender, address(tokenContract), _numberOfTokens, tokenPrice);
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
