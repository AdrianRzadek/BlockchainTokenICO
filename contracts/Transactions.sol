// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./FossaToken.sol";
import "hardhat/console.sol";

contract Transactions {
    address payable public admin;
    FossaToken public tokenContract;
    uint256 public tokenPrice = 1000000000000000;
    uint256 public tokensSold;
    uint256 public tokensValue;
    enum SaleState { Active, Ended }
    SaleState public saleState = SaleState.Active;

    event Buy(address indexed buyer, uint256 amount);
    event Sold(address indexed account, address indexed tokenContract, uint256 amount);
    event SaleEnded();

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can call this function");
        _;
    }

    modifier saleIsActive() {
        require(saleState == SaleState.Active, "The sale is not active");
        _;
    }

    constructor(FossaToken _tokenContract, uint256 _tokenPrice) {
        // Assign an admin
        admin = payable(msg.sender);
        // Token Contract
        tokenContract = _tokenContract;
        // Token Price
        tokenPrice = _tokenPrice;
    }

    // Buy tokens
    function buyTokens(uint256 _numberOfTokens) external payable saleIsActive {
        tokensValue = _numberOfTokens * tokenPrice;
      
        require(_numberOfTokens > 0, "Number of tokens must be greater than zero");
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, "Not enough tokens available");
        require(msg.value == (tokensValue), "Incorrect value sent");
        require(tokenContract.transfer(msg.sender, _numberOfTokens), "Token transfer failed");

        tokensSold += _numberOfTokens;
        emit Buy(msg.sender, _numberOfTokens);
    }

    // Sell tokens
    function sellTokens(uint256 _amount) external payable saleIsActive {
        require(tokenContract.balanceOf(msg.sender) >= _amount, "Insufficient token balance");
        require(address(this).balance >= _amount, "Insufficient Ether balance");
        require(tokenContract.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");

        uint256 etherAmount = _amount * tokenPrice;
        payable(msg.sender).transfer(etherAmount);
        tokensSold -= _amount;
        emit Sold(msg.sender, address(tokenContract), _amount);
    }

    // End token sale
    function endSale() external onlyAdmin {
        require(saleState == SaleState.Active, "The sale is already ended");

        // Withdraw remaining tokens to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))), "Token transfer to admin failed");

        // Withdraw remaining Ether to admin
        admin.transfer(address(this).balance);

        saleState = SaleState.Ended;
        emit SaleEnded();
    }

    // Withdraw Ether from the contract
    function withdrawEther(uint256 _amount) external onlyAdmin {
        require(address(this).balance >= _amount, "Insufficient Ether balance");
        admin.transfer(_amount);
    }

    // Fallback function
    receive() external payable {}

    // Circuit Breaker - Emergency stop
    function toggleSaleStatus() external onlyAdmin {
        saleState = (saleState == SaleState.Active) ? SaleState.Ended : SaleState.Active;
        if (saleState == SaleState.Active) {
            emit SaleEnded();
        }
    }
}
