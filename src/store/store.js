// src/store/store.js
import { createStore } from 'redux';

// Initial state
const initialState = {
  token: null,
  role: null,
};

// Actions
const SET_TOKEN = 'SET_TOKEN';
const SET_ROLE = 'SET_ROLE';

// Action creators
export const setToken = (token) => ({ type: SET_TOKEN, payload: token });
export const setRole = (role) => ({ type: SET_ROLE, payload: role });

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return { ...state, token: action.payload };
    case SET_ROLE:
      return { ...state, role: action.payload };
    default:
      return state;
  }
};

// Create store
const store = createStore(reducer);

// Export the store as default
export default store;
