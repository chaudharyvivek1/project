import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./counter/counterSlice.js";

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;
