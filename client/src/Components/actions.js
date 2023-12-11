export const SET_DAPP_TOKEN_SALE = 'SET_DAPP_TOKEN_SALE';
export const SET_DAPP_TOKEN = 'SET_DAPP_TOKEN';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const SET_LOAD_WEB3 = 'SET_LOAD_WEB3';
export const SET_IS_LOADING = 'SET_IS_LOADING';
export const SET_ADDRESS_SIGNER = 'SET_ADDRESS_SIGNER';
export const SET_LOADING_INFO = 'SET_LOADING_INFO';

export const setDappTokenSale = (dappTokenSale) => async (dispatch) => {
 
   const tokensSold = await dappTokenSale.tokensSold();
   const sold = tokensSold.toString();
   const tokenPrice= await dappTokenSale.tokenPrice();
   const price = tokenPrice.toString();
    const target = dappTokenSale.target;
  //const tokensAvailable = await dappTokenSale.tokensAvailable();
 //// const available = tokensAvailable.toString();
  console.log(dappTokenSale)
  dispatch({
    type: SET_DAPP_TOKEN_SALE,
    payload: {
      dappTokenSaleAddress: target,
      dappTokenSaleTokensSold: sold,
      dappTokenSalePrice: price,
    //  dappTokenSaleTokensAvailable: available,
    },
  });
};

export const setDappToken = (dappToken) => async (dispatch) => {
  const symbol = await dappToken.symbol();
  const decimals = await dappToken.decimals();
  const decimalsString = decimals.toString();
  console.log(dappToken)
  dispatch({
    type: SET_DAPP_TOKEN,
    payload: {
      dappTokenAddress: dappToken.target,
      dappTokenSymbol: symbol,
      dappTokenDecimals: decimalsString,
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
