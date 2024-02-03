// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./ForsaToken.sol";

contract Transactions {
    address payable public admin;
    ForsaToken public tokenContract;
    uint256 public price = 1000000000000000;
    uint256 public purchased;
    uint256 public newValue;
    enum IcoState {
        Active,
        Ended
    }
    //Stan sprzedazy
    IcoState public icoState = IcoState.Active;
    //Wydarzenia Kupno, Sprzedaz,
    event Buy(address indexed account, uint256 amount);
    event Sell(
        address indexed account,
        address indexed tokenContract,
        uint256 amount
    );
    //Stan sprzedazy
    event IcoEnded(address indexed admin);

    modifier icoIsActive() {
        require(icoState == IcoState.Active, "Sprzedaz nie aktywna");
        _;
    }

    //Konstruktor
    constructor(ForsaToken _tokenContract, uint256 _price) {
        // Assign an admin
        admin = payable(msg.sender);
        // Token Contract
        tokenContract = _tokenContract;
        // Token price
        price = _price;
    }

    //Struktura transakcji
    struct Transaction {
        address account;
        uint256 amountOfTokens;
        uint256 etherValue;
    }

    //Zakup
    function purchase(uint256 amountOfTokens) external payable icoIsActive {
        Transaction memory transaction = Transaction({
            account: msg.sender,
            amountOfTokens: amountOfTokens,
            etherValue: amountOfTokens * price
        });

        _executePurchase(transaction);
    }

    //Sprzedaz
    function swap(uint256 amountOfTokens) external payable icoIsActive {
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
        require(
            msg.value == transaction.etherValue,
            "Wyslano nieporawna wartosc"
        );
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
        require(
            transaction.amountOfTokens > 0,
            "Liczba tokenow musi byc wieksza niz 0"
        );
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

    // Struktura transferu
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
        TransferStruct(msg.sender, _receiver, _amount);

        require(
            tokenContract.transferFrom(msg.sender, _receiver, _amount),
            "Transfer tokenu nieudany"
        );
    }

    // Funkcja obsługuje przekazanie Etheru do kontraktu
    receive() external payable {}

   
}
