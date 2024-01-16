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
        require(msg.sender == admin, "Tylko wlasciel moze wywolac");
        _;
    }

    modifier saleIsActive() {
        require(saleState == SaleState.Active, "Sprzedaz nie aktywna");
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
        require(
            transaction.amountOfTokens > 0,
            "Liczba tokenow musi byc wieksza od zera"
        );
        require(
            tokenContract.balanceOf(address(this)) >=
                transaction.amountOfTokens,
            "Nie wystarczajaca ilosc tokenow"
        );
        require(msg.value == transaction.etherValue, "Wyslano nieporawna wartosc");
        require(
            tokenContract.transfer(
                transaction.account,
                transaction.amountOfTokens
            ),
            "Transfer nie udany"
        );

        purchased += transaction.amountOfTokens;
        emit Buy(transaction.account, transaction.amountOfTokens);
    }

    function _executeSwap(Transaction memory transaction) private {
        require(transaction.amountOfTokens > 0, "Liczba tokenow musi byc wieksza niz 0");
        require(
            tokenContract.balanceOf(transaction.account) >=
                transaction.amountOfTokens,
            "Niwystarczajacy balans tokenow"
        );
        require(
            address(this).balance >= transaction.etherValue,
            "Niewystarczajaca ilosc Etheru na koncie"
        );
        require(
            tokenContract.transferFrom(
                transaction.account,
                address(this),
                transaction.amountOfTokens
            ),
            "Transfer tokenow nieudany"
        );

        (bool success, ) = payable(transaction.account).call{
            value: transaction.etherValue
        }("");
        require(success, "Transfer Etheru nieudany");

        purchased -= transaction.amountOfTokens;

        emit Sell(
            transaction.account,
            address(tokenContract),
            transaction.amountOfTokens
        );
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
            "Transfer tokenu nieudany"
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
        require(saleState == SaleState.Active, "Sprzedaz sie skonczyla");

        // Withdraw remaining tokens to admin
        tokenContract.transfer(admin, tokenContract.balanceOf(address(this)));

        // Withdraw remaining Ether to admin
        withdrawTokens();

        saleState = SaleState.Ended;
        emit SaleEnded();
    }

    // Withdraw Ether from the contract
    function withdrawTokens() internal onlyAdmin {
        require(
            address(this).balance >= tokenContract.balanceOf(address(this)),
            "Niwystarczajacy balans tokenow"
        );
        admin.transfer(address(this).balance);
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
