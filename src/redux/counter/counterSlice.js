import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  userId: "guest",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // 1. Set current user OR guest and load cart
    setUserId: (state, action) => {
      state.userId = action.payload || "guest";

      const key = `cart_${state.userId}`;
      const saved = localStorage.getItem(key);

      state.cartItems = saved ? JSON.parse(saved) : [];
    },

    // 2. Add product
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.cartItems.find((p) => p._id === item._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }

      const key = `cart_${state.userId}`;
      localStorage.setItem(key, JSON.stringify(state.cartItems));
    },

    // 3. Decrease qty
    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cartItems.find((p) => p._id === productId);

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.cartItems = state.cartItems.filter((p) => p._id !== productId);
      }

      const key = `cart_${state.userId}`;
      localStorage.setItem(key, JSON.stringify(state.cartItems));
    },

    // 4. Remove item
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((p) => p._id !== productId);

      const key = `cart_${state.userId}`;
      localStorage.setItem(key, JSON.stringify(state.cartItems));
    },

    // 5. Clear user cart (logout)
    clearCart: (state) => {
      const key = `cart_${state.userId}`;
      localStorage.removeItem(key);
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  setUserId,
} = cartSlice.actions;

export default cartSlice.reducer;
