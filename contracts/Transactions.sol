// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./FossaToken.sol";

contract Transactions {
    address payable public admin;
    FossaToken public tokenContract;
    uint256 public transfersCounter;
    uint256 public price = 1000000000000000;
    uint256 public purchased;
    uint256 public newValue;
    enum SaleState {
        Active,
        Ended
    }
    SaleState public saleState = SaleState.Active;

    event Buy(address indexed account, uint256 amount);
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
     struct Transaction {
        address account;
        uint256 amountOfTokens;
        uint256 etherValue;
    }

    function purchase(uint256 amountOfTokens) external payable saleIsActive {
        Transaction memory transaction = Transaction({
            account: msg.sender,
            amountOfTokens: amountOfTokens,
            etherValue: amountOfTokens * price
        });

        _executePurchase(transaction);
    }

    function swap(uint256 amountOfTokens) external payable saleIsActive {
        Transaction memory transaction = Transaction({
            account: msg.sender,
            amountOfTokens: amountOfTokens,
            etherValue: amountOfTokens * price
        });

        _executeSwap(transaction);
    }

    function _executePurchase(Transaction memory transaction) private {
        require(transaction.amountOfTokens > 0, "Number of tokens must be greater than zero");
        require(tokenContract.balanceOf(address(this)) >= transaction.amountOfTokens, "Not enough tokens available");
        require(msg.value == transaction.etherValue, "Incorrect value sent");
        require(tokenContract.transfer(transaction.account, transaction.amountOfTokens), "Token transfer failed");

        purchased += transaction.amountOfTokens;
        emit Buy(transaction.account, transaction.amountOfTokens);
    }

    function _executeSwap(Transaction memory transaction) private {
        require(transaction.amountOfTokens > 0, "Invalid token amount");
        require(tokenContract.balanceOf(transaction.account) >= transaction.amountOfTokens, "Insufficient token balance");
        require(address(this).balance >= transaction.etherValue, "Insufficient Ether balance in the contract");
        require(tokenContract.transferFrom(transaction.account, address(this), transaction.amountOfTokens), "Token transfer failed");

        (bool success, ) = payable(transaction.account).call{value: transaction.etherValue}("");
        require(success, "Ether transfer failed");

        purchased -= transaction.amountOfTokens;

        emit Sell(transaction.account, address(tokenContract), transaction.amountOfTokens);
    }


 struct TransferStruct {
        address sender;
        address receiver;
        uint256 amount;
    }

    TransferStruct[] public transfers;

    function transfer(
        address payable _receiver,
        uint256 _amount
    ) public payable {
        transfersCounter += 1;

        // Add the transfer details to the transfers array
        transfers.push(TransferStruct(msg.sender, _receiver, _amount));

        // Ensure the token transfer is successful
        require(
            tokenContract.transferFrom(msg.sender, _receiver, _amount),
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
        return transfersCounter;
    }

    // Fallback function to receive Ether
    receive() external payable {}

    // Fallback function to receive Ether
    fallback() external payable {}

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
