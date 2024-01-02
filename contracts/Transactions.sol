// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./FossaToken.sol";

contract Transactions {
    address payable public admin;
    FossaToken public tokenContract;
    uint256 public price = 1000000000000000;
    uint256 public purchased;
    uint256 public newValue;
    enum SaleState {
        Active,
        Ended
    }
    SaleState public saleState = SaleState.Active;

    event Buy(address indexed buyer, uint256 amount);
    event Sell(
        address indexed account,
        address indexed tokenContract,
        uint256 amount
    );
    event SaleEnded();

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can call this function");
        _;
    }

    modifier saleIsActive() {
        require(saleState == SaleState.Active, "The sale is not active");
        _;
    }

    constructor(FossaToken _tokenContract, uint256 _price) {
        // Assign an admin
        admin = payable(msg.sender);
        // Token Contract
        tokenContract = _tokenContract;
        // Token price
        price = _price;
    }

    //Zakup tokenów
    function purchase(uint256 amountOfTokens) external payable saleIsActive {
        
        require(
            amountOfTokens > 0,
            "Number of tokens must be greater than zero"
        );

        newValue = amountOfTokens * price;

        require(
            tokenContract.balanceOf(address(this)) >= amountOfTokens,
            "Not enough tokens available"
        );
        require(msg.value == (newValue), "Incorrect value sent");
        require(
            tokenContract.transfer(msg.sender, amountOfTokens),
            "Token transfer failed"
        );

        purchased += amountOfTokens;
        emit Buy(msg.sender, amountOfTokens);
    }

    // Sell tokens
  function swap(uint256 amountOfTokens) external payable saleIsActive {
   

    // Ensure a non-zero amount of tokens is being swapped
    require(amountOfTokens > 0, "Invalid token amount");

    // Calculate the Ether amount based on the provided price
    uint256 etherAmount = amountOfTokens * price;

    // Check if the sender has enough tokens
    require(
        tokenContract.balanceOf(msg.sender) >= amountOfTokens,
        "Insufficient token balance"
    );

    // Check if the contract has enough Ether to proceed with the swap
    require(
        address(this).balance >= etherAmount,
        "Insufficient Ether balance in the contract"
    );

    // Transfer tokens from the sender to the contract
    require(
        tokenContract.transferFrom(msg.sender, address(this), amountOfTokens),
        "Token transfer failed"
    );

    // Transfer Ether from the contract to the sender
    (bool success, ) = payable(msg.sender).call{value: etherAmount}("");
    require(success, "Ether transfer failed");

    // Update the purchased variable
    purchased -= amountOfTokens;

    // Emit a Sell event
    emit Sell(msg.sender, address(tokenContract), amountOfTokens);
}

    // End token sale
    function end() external onlyAdmin {
        require(saleState == SaleState.Active, "The sale is already ended");

        // Withdraw remaining tokens to admin
        require(
            tokenContract.transfer(
                admin,
                tokenContract.balanceOf(address(this))
            ),
            "Token transfer to admin failed"
        );

        // Withdraw remaining Ether to admin
        admin.transfer(address(this).balance);

        saleState = SaleState.Ended;
        emit SaleEnded();
    }

    // Withdraw Ether from the contract
    function withdrawEther(uint256 amountOfTokens) external onlyAdmin {
        require(address(this).balance >= amountOfTokens, "Insufficient Ether balance");
        admin.transfer(amountOfTokens);
    }

    // Fallback function
    receive() external payable {}

    // Circuit Breaker - Emergency stop
    function toggleSaleStatus() external onlyAdmin {
        saleState = (saleState == SaleState.Active)
            ? SaleState.Ended
            : SaleState.Active;
        if (saleState == SaleState.Active) {
            emit SaleEnded();
        }
    }
}
