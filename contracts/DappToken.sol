// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "hardhat/console.sol";

contract DappToken {
    //name
    string public name = "FossaToken";
    //symbol
    string public symbol = "FOSSA";
    //standard
    string public standard = "Fossa Token v1.0";
    //decimals
    uint8 public constant decimals = 1;
    //max/total supply
    uint256 public totalSupply = 1000000;

    // An address type variable is used to store ethereum accounts.
    address public owner;


     //Transfer

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

      //I OWNER APPROVE ACCOUNT B to approve value
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );


    //ballance of our address
    mapping(address => uint256) public balanceOf;
    //allowance of remaining token to withdraw
    //account A approve account B to spend amount of C tokens
    mapping(address => mapping(address => uint256)) public allowance;

    //constractor
    //set the total number of tokens
    //Read the total number of tokens

    constructor(uint256 _initialSupply) {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }


    function transfer(address _to, uint256 _value) public returns (bool) {
        //exception if account doesn't exist
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");

        //return true/false
        //transfer the balance event
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    //approve
    function approve(address _spender, uint256 _value) public returns (bool) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //transferFrom
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool) {
        //require _from has enaught tokens
        require(_value <= balanceOf[_from]);
        //require allowance is big enought
        require(_value <= allowance[_from][msg.sender]);
        //change the balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        //update the allowance
        allowance[_from][msg.sender] -= _value;
        //transfer event
        emit Transfer(_from, _to, _value);
        //return true/false
        return true;
    }

}
