// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./DappToken.sol";
import "hardhat/console.sol";

contract DappTokenSale {
    address payable public admin;
    DappToken public tokenContract;
    uint256 public tokenPrice = 1000000000000000;
    uint256 public tokensSold;
   uint256 public rate = 1;
   

    event Sell(
        address _buyer,
        uint256 _amount
    );
      event Sold(
        address account,
        address tokenContract,
        uint256 amount,
        uint256 rate
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

     
    function sellTokens(uint256 _amount) public payable{
        
         // nie można sprzedać więcej niż się ma
        require(tokenContract.balanceOf(msg.sender) >= _amount);
        
        //przelicznik wymiany
        uint256 etherAmount = _amount*tokenPrice;
        
    // Require that Swap has enough Ether
    require(address(this).balance >= _amount, "Swap has not enought eth");

        //Wykonanie transferu
       require(tokenContract.transferFrom(msg.sender,address(this), _amount),"Token transfer failed");
        payable(msg.sender).transfer(etherAmount);
            tokensSold -= _amount;
        emit Sold(msg.sender, address(tokenContract), _amount, rate );
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
