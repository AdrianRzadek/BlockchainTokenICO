// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./FossaToken.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "hardhat/console.sol";

contract AirDrop {
    // Token contract reference
    FossaToken public immutable tokenContract;

    // Merkle root for the airdrop
    bytes32 public immutable root;

    // Reward amount for each claim
    uint256 public immutable rewardAmount;

    // Mapping to keep track of claimed addresses
    mapping(address => bool) public claimed;


    // Event emitted when a claim is successful
    event Claimed(address indexed recipient, uint256 amount);

    event checkRoot(bytes32 root);

    // Constructor to initialize the contract with token contract, Merkle root, and reward amount
    constructor(FossaToken _tokenContract, bytes32 _root, uint256 _rewardAmount) {
        tokenContract = _tokenContract;
        root = _root;
        rewardAmount = _rewardAmount;
    }

    
    // Function to allow users to claim their airdrop if they have a valid Merkle proof
    function claim(bytes32[] memory proof, address recipient) public {
        // Ensure the address has not claimed the airdrop before
        //console.log(recipient);
        emit checkRoot(root);
         console.log(rewardAmount);
        require(!claimed[recipient], "Already claimed AirDrop");

        // Mark the address as claimed
        claimed[recipient] = true;

        // Generate the Merkle leaf for the given address and reward amount
        bytes32 leaf = keccak256(abi.encode(recipient));
        
     
      
        // Verify the Merkle proof
        require(MerkleProof.verify(proof, root, leaf), "Invalid Merkle proof");

        // Mint the reward tokens to the recipient
        tokenContract.mint(recipient, rewardAmount);

        // Emit the claimed event for transparency
        emit Claimed(recipient, rewardAmount);
    }
}
