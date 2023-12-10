// actions.js

export const SET_DAPP_TOKEN_SALE = 'SET_DAPP_TOKEN_SALE';
export const SET_DAPP_TOKEN = 'SET_DAPP_TOKEN';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';


export const setDappTokenSale = (dappTokenSale) => ({
    type: 'SET_DAPP_TOKEN_SALE',
    payload: {dappTokenSaleAddress: dappTokenSale.target},
  });
  
  export const setDappToken = (dappToken) => async (dispatch) => {
    const symbol = await dappToken.symbol();
    const decimals = await dappToken.decimals();
    const decimalsString= decimals.toString();
    dispatch({
      type: 'SET_DAPP_TOKEN',
      payload: {
        dappTokenAddress: dappToken.target,
        dappTokenSymbol: symbol,
        dappTokenDecimals: decimalsString,
      },
    });
  };
  
  
  export const setTransactions = (transactions) => ({
    type: 'SET_TRANSACTIONS',
    payload:{ transactionsAddress: transactions.target},
  });
  
  // Add more actions for other state variables