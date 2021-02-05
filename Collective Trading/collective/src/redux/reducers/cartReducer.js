import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
  },
  reducers: {
    ADD_TO_CART: (state, action) => {
      if (
        state.products.findIndex(
          (x) => x.productId === action.payload.productId
        ) === -1
      ) {
        state.products.push(action.payload);
      }
    },

    REMOVE_FROM_CART: (state, action) => {
      const toDelete = state.products.findIndex(
        (x) => x.productId === action.payload.productId
      );
      state.products.splice(toDelete, 1);
    },
    EMPTY_CART: (state) => {
      state.products = [];
    },
  },
});

export const { ADD_TO_CART, REMOVE_FROM_CART, EMPTY_CART } = cartSlice.actions;

export default cartSlice.reducer;
