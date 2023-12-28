import React, { useEffect, useState, useCallback } from 'react';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { ethers } from 'ethers';
import { Buffer } from "buffer/";
import walletAddress from "../contracts/wallet-address.json";


  window.Buffer = window.Buffer || Buffer;

  
  const AirDropToken = ({ airDrop, dappTokenSale, provider }) => {

      if (airDrop && dappTokenSale && provider) {
        const addressProvider = provider && provider.addressProvider;
        const addresses = Object.values(walletAddress).map(x => keccak256(x));
  
        const filter = dappTokenSale.filters.Buy();
        const results = dappTokenSale.queryFilter(filter);
        if (results) {
          const tree = new MerkleTree(addresses, keccak256, { sortPairs: true });
          const root = tree.getHexRoot();
          const proof = tree.getHexProof(keccak256(addressProvider));
          const leaf = keccak256(addressProvider);
        //  console.log(addresses)
          console.log('leaf: ',leaf)
          console.log("Merkle Root:", root);
          console.log('proof: ', proof);
         console.log(tree.verify(proof, leaf, root));
        // console.log(tree.toString());
          const drop = async (event) => {
            event.preventDefault();
            try {
              const recipient = addressProvider;
              console.log(recipient)
              airDrop.claim(proof,recipient);
              console.log("AirDrop claimed successfully!");
            } catch (error) {
              console.error("Error claiming AirDrop:", error);
            }
          };
  
          return <div><form onSubmit={drop}><button type="submit">AirDrop</button></form></div>;
        }
    
      }

  };
  
  export default AirDropToken;
