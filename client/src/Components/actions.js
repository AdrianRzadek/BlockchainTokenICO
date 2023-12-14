export const SET_DAPP_TOKEN_SALE = 'SET_DAPP_TOKEN_SALE';
export const SET_DAPP_TOKEN = 'SET_DAPP_TOKEN';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const SET_LOAD_WEB3 = 'SET_LOAD_WEB3';
export const SET_IS_LOADING = 'SET_IS_LOADING';
export const SET_ADDRESS_SIGNER = 'SET_ADDRESS_SIGNER';
export const SET_LOADING_INFO = 'SET_LOADING_INFO';
export const SET_TOKENS_VALUE = 'SET_TOKENS_VALUE';



export const setTokenSale = (dappTokenSale) => async (dispatch) => {
  try {
    const tokenPrice = await dappTokenSale.tokenPrice();
    const price = tokenPrice.toString();
    console.log('Token Price:', price);

    dispatch({
      type: SET_DAPP_TOKEN_SALE,
      payload: {
        TokenSale: { Price: price },
      },
    });
  } catch (error) {
    console.error('Error setting token sale:', error);
  }
};



export const setDappToken = (dappToken) => async (dispatch) => {
  const symbol = await dappToken.symbol();
  const decimals = await dappToken.decimals();
  const decimalsString = decimals.toString();

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