import "./ShoppingCart.css";

import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import CondensedCard from "../ProductCard/CondensedCard";
import { useSelector, useDispatch } from "react-redux";
import { REMOVE_FROM_CART } from "../../redux/reducers/cartReducer";
import { useHistory } from "react-router-dom";
import { calcCartTotal } from "../../utility";

export default function ShoppingCart() {
  const history = useHistory();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.products);
  const authStatus = useSelector((state) => state.auth.loggedIn);

  const removeFromCart = (item) => {
    dispatch(REMOVE_FROM_CART(item));
  };

  const goToCheckout = () => {
    if (cartItems.length > 0) {
      if (authStatus === true) {
        history.push("/checkout");
      } else {
        history.push({
          pathname: "/login",
          state: { redirectUrl: "/checkout" },
        });
      }
    } else {
    }
  };

  const [total, setTotal] = useState(0.0);

  useEffect(() => {
    const calcTotal = () => {
      const sum = calcCartTotal(cartItems);
      setTotal(Math.round((sum + Number.EPSILON) * 100) / 100);
    };

    calcTotal();
  }, [cartItems]);

  return (
    <div>
      <Navbar />
      <div className="shoppingCart">
        <h1>Shopping Cart</h1>

        {cartItems.map((thing, index) => (
          <div key={index} className="cartItem">
            <CondensedCard item={thing} deleteProduct={removeFromCart} />
          </div>
        ))}

        {total > 0 ? (
          <h3>Total: ${total} </h3>
        ) : (
          <h3>
            Your cart is empty! But it doesn't have to be. Collective is your
            one-stop shop for trading! Look around and see what you can find at
            amazing deals!
          </h3>
        )}

        {cartItems.length > 0 ? (
          <button className="checkout-btn" onClick={goToCheckout}>
            Checkout
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
