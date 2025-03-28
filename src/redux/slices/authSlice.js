// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
