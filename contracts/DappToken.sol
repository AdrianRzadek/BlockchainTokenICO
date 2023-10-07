// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "hardhat/console.sol";

contract DappToken {
    //name
    string public name = "DApp Token";
    //symbol
    string public symbol = "DAPP";
    //standard
    string public standard = "DApp Token v1.0";
    //decimals
    uint8 public constant decimals = 18;
    //max/total supply
    uint256 public totalSupply = 1000000;

    // An address type variable is used to store ethereum accounts.
    address public owner;

    //ballance of our address
    mapping(address => uint256) balance;
    //allowance of remaining token to withdraw
    //account A approve account B to spend amount of C tokens
    mapping(address => mapping(address => uint256)) public allowance;

    //constractor
    //set the total number of tokens
    //Read the total number of tokens

    constructor() {
        balance[msg.sender] = totalSupply;
        owner = msg.sender;
       
    }

    //Transfer

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    //I OWNER APPROVE ACCOUNT B to approve value
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    function transfer (
        address _to,
        uint256 _value
    ) external returns (bool success) {
        //exception if account doesn't exist
        require(balance[msg.sender] >= _value , "Insufficient balance");
        require(_to != address(0), "Invalid address");

         console.log("Transferring from %s to %s %s tokens", msg.sender, _to, _value);

        //return true/false
        //transfer the balance event
        balance[msg.sender] -= _value;
        balance[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    //approve
     function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //transferFrom
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        //require _from has enaught tokens
        require(_value <= balance[_from]);
        //require allowance is big enought
        require(_value <= allowance[_from][msg.sender]);
        //change the balance
        balance[_from] -= _value;
        balance[_to] += _value;
        //update the allowance
        allowance[_from][msg.sender] -= _value;
        //transfer event
        emit Transfer(_from, _to, _value);
        //return true/false
        return true;
    }

    function balanceOf(address _account) external view returns (uint256) {
        return balance[_account];
    }
}
