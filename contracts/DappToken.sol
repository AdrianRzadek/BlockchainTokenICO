// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "hardhat/console.sol";

contract DappToken {
    //name
    string public name = "FossaToken";
    //symbol
    string public symbol = "FOSSA";
    //standard
    string public standard = "Fossa Token v1.0";
    //decimals
    uint8 public constant decimals = 0;
    //max/total supply
    uint256 public totalSupply = 1000000;

    // An address type variable is used to store ethereum accounts.
    address public owner;

     //Transfer

    event Transfer(address indexed _from, address indexed _to, uint256 value);

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
        // Assign the contract deployer as the owner //new
        owner = msg.sender;
        
    }


    function transfer(address _to, uint256 _value) public returns (bool) {
        
        //without decimals in token value
        //uint256 value = _value*10;
        console.log(_value);
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
        
        require(_spender != address(0), "Invalid spender address");
      
        
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
        require(_value <= allowance[_from][msg.sender],"allowance is not big enought");
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
    
   function mint(address to, uint256 amount) public {
        // Only allow the contract owner (or another authorized entity) to mint
        // You might want to implement access control here
        require(msg.sender == owner, "Only owner can mint");

        // Ensure the minted amount is non-zero
        require(amount > 0, "Mint amount must be greater than zero");

        // Mint new tokens and update the balance
        balanceOf[to] += amount;

        // Emit a transfer event
        emit Transfer(address(0), to, amount);
    }
}

