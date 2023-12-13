// reducers.js
import { combineReducers } from '@reduxjs/toolkit';
import {
  SET_DAPP_TOKEN_SALE,
  SET_DAPP_TOKEN,
  SET_TRANSACTIONS,
  SET_IS_LOADING,
  SET_ADDRESS_SIGNER,
  SET_LOADING_INFO,
  SET_TOKENS_VALUE,
} from "./actions";

const initialState = {
  dappTokenSale: {
    // dappTokenSaleAddress: null,
    // dappTokenSalePrice: null,
    // dappTokenSaleTokensSold: null,
    // dappTokenSaleTokensAvailable: null,
    dappTokenSale: null,
  },
  dappToken: {
    dappTokenDecimals: null,
    dappTokenAddress: null,
    dappTokenSymbol: null,
    dappTokenBalance: null,
    dappTokenApprove: null,
  
    
  },
  transactions: { transactionsAddress : null },
  isLoading: false,
  addressSigner: null,
  loadingInfo: null,
  tokensEchange: null,
};

// const dappTokenSaleReducer = (state = initialState.dappTokenSale, action) => {
//   if (action.type === SET_DAPP_TOKEN_SALE) {
//     return {
//       ...state,
//       dappTokenSale: { ...state.dappTokenSale, ...action.payload.dappTokenSale },
//     };
//   }
//   return state;
// };

const dappTokenReducer = (state = initialState.dappToken, action) =>
  action.type === SET_DAPP_TOKEN ? action.payload : state;

const transactionsReducer = (state = initialState.transactions, action) => {
  switch (action.type) {
    case SET_TRANSACTIONS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const isLoadingReducer = (state = initialState.isLoading, action) => {
  switch (action.type) {
    case SET_IS_LOADING:
      return action.payload.isLoading;
    default:
      return state;
  }
};

const addressSignerReducer = (state = initialState.addressSigner, action) => {
  switch (action.type) {
    case SET_ADDRESS_SIGNER:
      return action.payload.addressSigner;
    default:
      return state;
  }
};


const loadingInfoReducer = (state = initialState.loadingInfo, action) => {
  switch (action.type) {
    case SET_LOADING_INFO:
      return action.payload.loadingInfo;
    default:
      return state;
  }
};
const tokensExchangeReducer = (state = initialState.tokensEchange, action) => {
  switch (action.type) {
    case SET_TOKENS_VALUE:
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
 // dappTokenSale: dappTokenSaleReducer,
  dappToken: dappTokenReducer,
  transactions: transactionsReducer,
  isLoading: isLoadingReducer,
  addressSigner: addressSignerReducer,
  loadingInfo: loadingInfoReducer,
  tokensExchangeReducer: tokensExchangeReducer,
});

export default rootReducer;