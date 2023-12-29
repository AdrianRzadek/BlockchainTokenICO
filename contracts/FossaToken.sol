// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "hardhat/console.sol";

contract FossaToken {
    // Name of the token
    string public name = "FossaToken";
    // Symbol of the token
    string public symbol = "FOSSA";
    // Standard of the token
    string public standard = "FossaToken v1.0";
    // Decimals of the token
    uint8 public constant decimals = 0;
    // Total supply of the token
    uint256 public totalSupply ;
    // Owner of the contract
    address public owner;

     // Event emitted when tokens are transferred
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    // Event emitted when an approval is made
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    // Mapping of token balances for each address
    mapping(address => uint256) public balanceOf;
    // Mapping of allowances for each address
    mapping(address => mapping(address => uint256)) public allowance;

    // Constructor
    constructor(uint256 _initialSupply) {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
        // Assign the contract deployer as the owner
        owner = msg.sender;
    }

    /**
     * Transfer tokens from the sender's address to the specified address.
     * @param _to The address to transfer tokens to.
     * @param _value The amount of tokens to transfer.
     * @return Returns true if the transfer is successful, otherwise false.
     */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    /**
     * Approve the specified address to spend the sender's tokens.
     * @param _spender The address to approve.
     * @param _value The amount of tokens to approve.
     * @return Returns true if the approval is successful, otherwise false.
     */
    function approve(address _spender, uint256 _value) public returns (bool) {
        require(_spender != address(0), "Invalid spender address");

        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /**
     * Transfer tokens from one address to another.
     * @param _from The address to transfer tokens from.
     * @param _to The address to transfer tokens to.
     * @param _value The amount of tokens to transfer.
     * @return Returns true if the transfer is successful, otherwise false.
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender], "Allowance is not big enough");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    /**
     * Mint new tokens and update the balance of the specified address.
     * Only the contract owner (or another authorized entity) can mint new tokens.
     * @param to The address to mint tokens to.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) public {
        require(msg.sender == owner, "Only owner can mint");
        require(amount > 0, "Mint amount must be greater than zero");

        balanceOf[to] += amount;

        emit Transfer(address(0), to, amount);
    }
}