// store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Import the default storage method (localStorage)
import cartSlice from './slices/cartSlice';
import favSlice from './slices/favSlice';
import authSlice from './slices/authSlice';

const rootReducer = {
  cart: cartSlice,
  fav: favSlice,
  auth:authSlice
};

const persistConfig = {
  key: 'root', // key under which your persisted data will be stored
  storage,
};

const persistedReducer = persistCombineReducers(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };
