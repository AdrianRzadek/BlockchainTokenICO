// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

//import "./DappToken.sol";
/*
contract DappTokenSaleFactory {
    event TokenSaleCreated(address indexed tokenSale, address indexed tokenContract, uint256 tokenPrice);

    function createTokenSale(DappToken _tokenContract, uint256 _tokenPrice) public {
        DappTokenSale tokenSale = new DappTokenSale(_tokenContract, _tokenPrice);
        emit TokenSaleCreated(address(tokenSale), address(_tokenContract), _tokenPrice);
    }
}

contract DappTokenSale {
    address payable public admin;
    DappToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;
    mapping(address => uint256) public balances;

    bool public isPaused;
    bool public isSaleEnded;

    event Sell(address indexed buyer, uint256 amount);
    event TokensSold(address indexed account, address indexed tokenContract, uint256 amount);
    event TokensWithdrawn(address indexed account, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can perform this action");
        _;
    }

    modifier whenNotPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }

    modifier whenSaleNotEnded() {
        require(!isSaleEnded, "Token sale has ended");
        _;
    }

    constructor(DappToken _tokenContract, uint256 _tokenPrice) {
        admin = payable(msg.sender);
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
        isPaused = false;
        isSaleEnded = false;
    }

    function buyTokens(uint256 _numberOfTokens) public payable whenNotPaused whenSaleNotEnded {
        require(
            msg.value == (_numberOfTokens * tokenPrice),
            "Incorrect value sent"
        );

        require(
            tokenContract.balanceOf(address(this)) >= _numberOfTokens,
            "Not enough tokens available"
        );

        require(
            tokenContract.transfer(msg.sender, _numberOfTokens),
            "Token transfer failed"
        );

        tokensSold += _numberOfTokens;
        balances[msg.sender] += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }

    function sellTokens(uint256 _amount) public payable whenNotPaused whenSaleNotEnded {
        require(balances[msg.sender] >= _amount, "Insufficient token balance");

        require(
            tokenContract.transferFrom(msg.sender, address(this), _amount),
            "Token transfer failed"
        );

        uint256 etherAmount = _amount * tokenPrice;
        payable(msg.sender).transfer(etherAmount);
        tokensSold -= _amount;
        balances[msg.sender] -= _amount;
        emit TokensSold(msg.sender, address(tokenContract), _amount);
    }

    function withdrawTokens() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No tokens to withdraw");

        require(
            tokenContract.transfer(msg.sender, amount),
            "Token transfer failed"
        );

        balances[msg.sender] = 0;
        emit TokensWithdrawn(msg.sender, amount);
    }

    function endSale() public onlyAdmin whenNotPaused {
        require(!isSaleEnded, "Token sale has already ended");

        require(
            tokenContract.transfer(admin, tokenContract.balanceOf(address(this))),
            "Token transfer to admin failed"
        );

        admin.transfer(address(this).balance);
        isSaleEnded = true;
    }

    function pauseContract() public onlyAdmin {
        require(!isPaused, "Contract is already paused");
        isPaused = true;
    }

    function resumeContract() public onlyAdmin {
        require(isPaused, "Contract is not paused");
        isPaused = false;
    }

    receive() external payable {}

    fallback() external payable {}
}*/