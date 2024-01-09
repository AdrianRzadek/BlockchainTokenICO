// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract FossaToken {

    // Owner of the contract
    address public owner;
    // Name of the token
    string public name = "FossaToken";
    // Symbol of the token
    string public symbol = "FOSSA";
    // Decimals of the token
    uint8 public constant decimals = 0;
    // Total supply of the token
    uint256 public totalSupply;
  
  

    // Event emitted when tokens are transferred
    event Transfer(
        address indexed _from,
     address indexed _to, 
     uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(uint256 supply) {
        owner = msg.sender;
        balanceOf[owner] = supply;
        totalSupply = supply;
        
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function _transfer(address _from, address _to, uint256 _value) internal {
        require(_to != address(0), "Invalid recipient address");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(_from, _to, _value);
    }
function approve(address _spender, uint256 _value) public returns (bool) {
    require(_spender != address(0), "Invalid spender address");

    // Ensure the allowance is set to a non-negative value
    require(_value >= 0, "Negative allowance not allowed");

    // If allowance was previously set, handle decrease in a gas-efficient way
    if (_value < allowance[msg.sender][_spender]) {
        allowance[msg.sender][_spender] = _value;
    } else if (_value > allowance[msg.sender][_spender]) {
        // If allowance is increased, update the allowance and emit Approval event
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
    }

    return true;
}

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool) {
          // Ensure the transfer amount is non-zero
    require(_value > 0, "Transfer amount must be greater than zero");

    // Ensure the source account has sufficient balance
    require( balanceOf[_from] >= _value, "Insufficient balance");

    // Ensure the allowance is set to a non-negative value
    require(allowance[_from][msg.sender] >= _value, "Allowance is not big enough");

    // Check for overflow or underflow in balance adjustment
    require(balanceOf[_to] + _value > balanceOf[_to], "Overflow in destination balance");

    // Check for overflow in allowance adjustment
    require(allowance[_from][msg.sender] - _value <= allowance[_from][msg.sender], "Underflow in allowance");


        allowance[_from][msg.sender] -= _value;

        _transfer(_from, _to, _value);


        return true;
    }

    // Owner can mint new tokens
    function mint(uint256 _amount) public onlyOwner {
        require(_amount > 0, "Minted amount must be greater than zero");
        totalSupply += _amount;
        balanceOf[owner] += _amount;
        emit Transfer(address(0), owner, _amount);
    }

    // Owner can transfer ownership
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
    }

     receive() external payable {}
      fallback() external payable {}
}
