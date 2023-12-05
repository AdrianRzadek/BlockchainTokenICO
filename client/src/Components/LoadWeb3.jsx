import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import LoadingScreen from "./LoadingScreen"


const LoadWeb3 = () => {
  const [addressSigner, setAddressSigner] = useState('');
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
const fetchData = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = provider.getSigner();
      const addressSigner = await signer.getAddress();
      setAddressSigner(addressSigner);
      setSigner(signer);
      setProvider(provider);
    } catch (error) {
       
      console.error('User denied account access');
      window.alert('User denied account access');
    }
  } else if (window.web3) {
    const provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
    setWeb3(provider);
  } else {
    window.alert('No Ethereum browser extension detected, install MetaMask!');
  }
};
    fetchData();
  }, []);

 return( <LoadingScreen />);
};
export default LoadWeb3;