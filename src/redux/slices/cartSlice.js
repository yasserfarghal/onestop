import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  totalAmount: 0,
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(item => item.id === newItem.id);

      state.totalQuantity++;
      if (!existingItem) {
        state.cartItems.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: 1,
          totalPrice: parseFloat(newItem.price), // Convert to number
          img: newItem.img,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = parseFloat(existingItem.price) * existingItem.quantity; // Convert to number
      }

      state.totalAmount = state.cartItems.reduce((total, item) => total + item.totalPrice, 0);
    },
    deleteItem: (state, action) => {
      const delItem = action.payload;
      const removingItem = state.cartItems.find(item => item.id === delItem.id);

      if (removingItem.quantity > 0) {
        state.totalQuantity--;
        removingItem.quantity--;
        removingItem.totalPrice = parseFloat(removingItem.price) * removingItem.quantity; // Convert to number
      }

      // Check if quantity becomes 0, and remove the item from the cart
      if (removingItem.quantity === 0) {
        state.cartItems = state.cartItems.filter(item => item.id !== removingItem.id);
      }

      state.totalAmount = state.cartItems.reduce((total, item) => total + item.totalPrice, 0);
    },
    resetCart: () => initialState,
  },
});

export const cartAction = cartSlice.actions;
export default cartSlice.reducer;
