import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    favItems: [],
    totalFavs: 0
}

const favSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    addFav:(state,action) => {
        const newItem = action.payload.id;
        const favItem = state.favItems.find(item => item.id === newItem.id);

        if (!favItem) {
            state.favItems.push({
                id: newItem.id,
                name: newItem.name,
                price: newItem.price,
                desc: newItem.desc,
                img: newItem.img,
            })
            state.totalFavs++

        }

        
  
  

    },
    remFav:(state,action) => {
      const newItem = action.payload.id;
      const favItem = state.favItems.find(item => item.id === newItem.id);

      if (favItem) {
          state.favItems.pop({
              id: newItem.id,
              name: newItem.name,
              price: newItem.price,
              desc: newItem.desc,
              img: newItem.img,
          })
          state.totalFavs--

      }

      



  },
    resetFavs: () => initialState,
    

  },
});

export const favActions = favSlice.actions

export default favSlice.reducer