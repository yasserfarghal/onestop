import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favItems: [],
  totalFavs: 0
};

const favSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    addFav: (state, action) => {
      const newItem = action.payload; // Now it should be the entire product object
      const favItem = state.favItems.find(item => item.id === newItem.id);

      if (!favItem) {
        state.favItems.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          desc: newItem.desc,
          img: newItem.img,
        });
        state.totalFavs++;
      }
    },
    remFav: (state, action) => {
      const newItem = action.payload; // Now it should be the entire product object
      state.favItems = state.favItems.filter(item => item.id !== newItem.id); // Remove the item correctly
      state.totalFavs--;
    },
    resetFavs: () => initialState,
  },
});

export const favActions = favSlice.actions;

export default favSlice.reducer;
