import React, { useEffect, useState } from 'react';
import { makeMerkleTree } from "@openzeppelin/merkle-tree/dist/core";
import { keccak256 } from "@ethersproject/keccak256";
import { ethers } from 'ethers';
const AirDropToken = ({ airDrop, dappTokenSale, provider }) => {
  const [addressSigner, setAddressSigner] = useState([]);

  useEffect(() => {
    if(airDrop && dappTokenSale && provider) {

      const blockNumberCutoff = 11;

  
        const shuffle = [];
        while (shuffle.length < 20) {
          let r = Math.floor(Math.random() * 20);
          if (shuffle.indexOf(r) === -1) {
            shuffle.push(r);
          }
        }
    
    
        // Promise.all(shuffle.map(async (i, indx) => {
        //   const receipt = await (await dappTokenSale.connect(addrs[i]).buyTokens(ethers.toBigInt(numberOfTokens), { value: etherAmount }))}));
        //   fetchData();
          
    
    const addressProvider = provider && provider.addressProvider;
    setAddressSigner(addressProvider);
   
    const fetchData = async () => {
      const leafNodes = [];
      //contract block number
      const Provider =dappTokenSale.runner.provider;
      const blockNumber = await Provider.getBlockNumber();
      console.log("Latest block number:", blockNumber);
      const blockNumberAfter = blockNumber + 1;
      const filter = await dappTokenSale.filters.Sell();
      console.log("Filters:", filter);
      const results = await dappTokenSale.queryFilter(
        filter,
        blockNumber,
        blockNumberAfter, 
      );

      const leafs = results.map(i => keccak256(i.args.account));
      console.log("Leaf Nodes:", leafs);
      leafNodes.push(...leafs.map(buffer => '0x' + buffer.toString('hex')));

      return leafNodes;
      
    };

    const claimAddresses = async (leafNodes) => {
      const merkleTree = new makeMerkleTree(leafNodes, keccak256, { sortPairs: true });
      const rootHash = merkleTree.getRoot();
      console.log("Merkle Root:", rootHash);

      for (const addressToHash of addressSigner) {
        console.log("Address Hash:", addressToHash);
        const addressHash = keccak256(addressToHash);
        console.log("Address Hash:", addressHash);
        const proof = merkleTree.getHexProof(addressHash);
        console.log("Proof:", proof);
        await airDrop.claim(addressToHash, proof);
      }
    };

    const fetchDataAndClaim = async () => {
      const leafNodes = await fetchData();
      await claimAddresses(leafNodes);
    };

    if (airDrop && dappTokenSale && addressSigner.length > 0) {
      fetchDataAndClaim();
    }
      
  }
  }, [dappTokenSale, airDrop, addressSigner, provider]);


  return <div>Functional React Component</div>;
};

export default AirDropToken;
