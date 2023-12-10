// reducers.js
import { combineReducers } from '@reduxjs/toolkit';
import{SET_DAPP_TOKEN_SALE,SET_DAPP_TOKEN}from "./actions";
const initialState = {
  dappTokenSale: {},
  dappToken: {dappTokenDecimals: null,
  dappTokenAddress: null,
  dappTokenSymbol: null,},
  transactions: {},
  // Add more state variables
};

const dappTokenSaleReducer = (state = initialState.dappTokenSale, action) => {
  switch (action.type) {
    case SET_DAPP_TOKEN_SALE:
      return action.payload;
    default:
      return state;
  }
};

const dappTokenReducer = (state = initialState.dappToken, action) =>
  action.type === SET_DAPP_TOKEN ? action.payload : state;

const transactionsReducer = (state = initialState.transactions, action) => {
  // Ensure that the reducer returns the state if action type is not recognized
  switch (action.type) {
    // Add more cases for specific actions if needed
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  dappTokenSale: dappTokenSaleReducer,
  dappToken: dappTokenReducer,
  transactions: transactionsReducer,
  // Add more reducers for other state variables
});

export default rootReducer;
