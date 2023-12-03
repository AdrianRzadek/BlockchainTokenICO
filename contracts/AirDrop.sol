// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./DappToken.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "hardhat/console.sol";
contract AirDrop {
    DappToken public tokenContract;
    bytes32 public immutable root;
    uint256 public rewardAmount;

    mapping(address => bool) claimed;

    constructor(DappToken _tokenContract, bytes32 _root, uint256 _rewardAmount) {
        tokenContract = _tokenContract;
        root = _root;
        rewardAmount = _rewardAmount;
    }

    function claim(
        bytes32[] memory proof,
        address addr
    ) public {
        require(!claimed[addr], "Already claimed AirDrop");
        claimed[addr] = true;

      bytes32 leaf = keccak256(abi.encode(addr, rewardAmount));

        require(MerkleProof.verify(proof, root, leaf), "Invalid Merkle proof");
        tokenContract.mint(addr, rewardAmount);
    }
  
}
