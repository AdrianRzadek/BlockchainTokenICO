import React, { useEffect } from 'react';

import { makeMerkleTree } from "@openzeppelin/merkle-tree/dist/core";
import { keccak256 } from "@ethersproject/keccak256";
const AirDropComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      var blockNumberCutoff;
      var contractBlocknumber = await this.airDrop;
      const filter = this.dappTokenSale.filters.Sell();
      const results = await this.dappTokenSale.queryFilter(
        filter,
        contractBlocknumber,
        blockNumberCutoff
      );
      const leafs = results.map(i => keccak256(i.args.account));
      console.log("Leaf Nodes:", leafs);
      const leafNodes = leafs.map(buffer => '0x' + buffer.toString('hex'));

      var merkleTree = new makeMerkleTree(leafNodes, keccak256, { sortPairs: true });
      const rootHash = merkleTree.getRoot();
      console.log("Merkle Root:", rootHash);

      this.state.addressSigner.forEach(async (addressToHash) => {
        console.log("Address Hash:", addressToHash);
        const addressHash = keccak256(addressToHash);
        console.log("Address Hash:", addressHash);
        const proof = merkleTree.getHexProof(addressHash);
        console.log("Proof:", proof);
        await this.airDrop.claim(addressToHash, proof);
      });
    };

    fetchData();
  }, []);

  return <div>Functional React Component</div>;
};

export default AirDropComponent;