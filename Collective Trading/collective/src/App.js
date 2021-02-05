import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home/Home";
import Seller from "./components/Seller/Seller";
import ProductPage from "./components/ProductPage/ProductPage";
import ShoppingCart from "./components/ShoppingCart/ShoppingCart";
import LoginPage from "./components/LoginPage/LoginPage";
import Checkout from "./components/Checkout/Checkout";
import SignUp from "./components/LoginPage/SignUp";
import OrderHistory from "./components/OrderHistory/OrderHistory";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51IGslsDSJIc457LauFrAzZuqm39fqF3y3DXzVa36O96gjpi0woH3Z6P9NrcEIUfRbrpEzaJIab02Y33mr3XWB1qW00KnhIqE9T"
);

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/signUp" component={SignUp} />

          <Route path="/checkout">
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
          </Route>
          <Route path="/orders" component={OrderHistory} />

          <Route path="/login" component={LoginPage} />
          <Route path="/cart" component={ShoppingCart} />
          <Route path="/products" component={ProductPage} />
          <Route path="/seller" component={Seller} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
