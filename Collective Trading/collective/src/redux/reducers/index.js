import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import authReducer from "./authReducer";

const combinedReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
});

export default combinedReducer;
