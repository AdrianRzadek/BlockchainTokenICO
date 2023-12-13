export const SET_DAPP_TOKEN_SALE = 'SET_DAPP_TOKEN_SALE';
export const SET_DAPP_TOKEN = 'SET_DAPP_TOKEN';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const SET_LOAD_WEB3 = 'SET_LOAD_WEB3';
export const SET_IS_LOADING = 'SET_IS_LOADING';
export const SET_ADDRESS_SIGNER = 'SET_ADDRESS_SIGNER';
export const SET_LOADING_INFO = 'SET_LOADING_INFO';
export const SET_TOKENS_VALUE = 'SET_TOKENS_VALUE';

/*export const setDappTokenSale = (dappTokenSale, dappToken) => async (dispatch) => {
 
  const DappTokenSale = dappTokenSale.toString();
  //  const tokensSold = await dappTokenSale.tokensSold();
  //  const sold = tokensSold.toString();
  //  const tokenPrice= await dappTokenSale.tokenPrice();
  //  const price = tokenPrice.toString();
  //   const target = dappTokenSale.target;
  //   const tokensAvailable = await dappToken.balanceOf(
  //    target
  //   );
  //   const available = tokensAvailable.toString();
  //  const buyTokens = await dappTokenSale.buyTokens(null);
  //  const buy= buyTokens.toString();

  //console.log(dappToken)
  dispatch({
    type: SET_DAPP_TOKEN_SALE,
    payload: {
    //  dappTokenSaleAddress: target,
    //  dappTokenSaleTokensSold: sold,
    //  dappTokenSalePrice: price,
   //  dappTokenSaleTokensAvailable: available,
    DappTokenSale: DappTokenSale
    },
  });
};
*/

// export const setDappTokenSale = (dappTokenSale) => async (dispatch) => {
 
//   const DappTokenSale = JSON.stringify(dappTokenSale);


//   dispatch({
//     type: SET_DAPP_TOKEN_SALE,
//     payload: {

//     dappTokenSale: DappTokenSale
//     }
//   });

// };

export const setDappToken = (dappToken) => async (dispatch) => {
  const symbol = await dappToken.symbol();
  const decimals = await dappToken.decimals();
  const decimalsString = decimals.toString();
 // const approveTarget = await dappToken.approve();
  ///const approve = await approveTarget.toString();
  //console.log(dappToken)
  dispatch({
    type: SET_DAPP_TOKEN,
    payload: {
      dappTokenAddress: dappToken.target,
      dappTokenSymbol: symbol,
      dappTokenDecimals: decimalsString,
     // dappTokenApprove: approve,
    },
  });
};

export const setTransactions = (transactions) => ({
  type: SET_TRANSACTIONS,
  payload: { transactionsAddress: transactions.target },
});

export const setLoadWeb3 = (loadWeb3) => ({
  type: SET_LOAD_WEB3,
  payload: {
    signerAddress: loadWeb3.signerAddress,
    providerAddress: loadWeb3.providerAddress,
  },
});

export const setIsLoading = (isLoading) => ({
  type: SET_IS_LOADING,
  payload: { isLoading },
});

export const setAddressSigner = (addressSigner) => ({
  type: SET_ADDRESS_SIGNER,
  payload: { addressSigner },
});


export const setLoadingInfo = (loadingInfo) => ({
  type: SET_LOADING_INFO,
  payload: { loadingInfo },
});

export const setTokensValue = (tokensValue) => ({
  type: SET_TOKENS_VALUE,
  payload: { tokensValue },
});