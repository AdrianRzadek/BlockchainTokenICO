// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./DappToken.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract AirDrop {
    DappToken public tokenContract;
    bytes32 public immutable root;

    mapping(address => bool) claimed;

    constructor(DappToken _tokenContract, bytes32 _root) {
        tokenContract = _tokenContract;
        root = _root;
    }

    function claim(
        bytes32[] memory proof,
        address addr,
        uint256 rewardAmount
    ) public {
        require(!claimed[addr], "Already claimed AirDrop");
        claimed[addr] = true;

        bytes32 leaf = keccak256(abi.encode(addr, rewardAmount));

        require(MerkleProof.verify(proof, root, leaf), "Invalid proof");
        tokenContract.mint(addr, rewardAmount);
    }
}
