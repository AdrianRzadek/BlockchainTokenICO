import { combineReducers } from '@reduxjs/toolkit';
import {
  SET_DAPP_TOKEN_SALE,
  SET_DAPP_TOKEN,
  SET_TRANSACTIONS,
  SET_IS_LOADING,
  SET_ADDRESS_SIGNER,
  SET_LOADING_INFO,
  SET_TOKENS_VALUE,
} from './actions';

const initialState = {
  TokenSale: {
    Price: null,
  },
  dappToken: {
    dappTokenDecimals: null,
    dappTokenAddress: null,
    dappTokenSymbol: null,
    dappTokenBalance: null,
    dappTokenApprove: null,
  },
  transactions: { transactionsAddress: null },
  isLoading: false,
  addressSigner: null,
  loadingInfo: null,
  tokensExchange: null,
};

const dappTokenSaleReducer = (state = initialState.TokenSale, action) => {
  switch (action.type) {
    case SET_DAPP_TOKEN_SALE:
      return {
        ...state,
        ...action.payload.TokenSale,
      };
    default:
      return state;
  }
};

const dappTokenReducer = (state = initialState.dappToken, action) => {
  switch (action.type) {
    case SET_DAPP_TOKEN:
      return action.payload;
    default:
      return state;
  }
};

const transactionsReducer = (state = initialState.transactions, action) => {
  switch (action.type) {
    case SET_TRANSACTIONS:
      return {
        ...state,
        ...action.payload,
      };
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

const tokensExchangeReducer = (state = initialState.tokensExchange, action) => {
  switch (action.type) {
    case SET_TOKENS_VALUE:
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  TokenSale: dappTokenSaleReducer,
  dappToken: dappTokenReducer,
  transactions: transactionsReducer,
  isLoading: isLoadingReducer,
  addressSigner: addressSignerReducer,
  loadingInfo: loadingInfoReducer,
  tokensExchange: tokensExchangeReducer,
});

export default rootReducer;