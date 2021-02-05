import "./Checkout.css";
import Navbar from "../Navbar/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { REMOVE_FROM_CART } from "../../redux/reducers/cartReducer";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { calcCartTotal } from "../../utility";
import CondensedCard from "../ProductCard/CondensedCard";
import { db } from "../../firebase";
import firebase from "firebase/app";
import { EMPTY_CART } from "../../redux/reducers/cartReducer";

const BASE_URL = process.env.REACT_APP_BASE_URL;
export default function Checkout() {
  const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();
  const cardOptions = {
    iconStyle: "solid",
    style: {
      base: {
        iconColor: "#939393",
        color: "#3C3C3C",
        fontWeight: 700,
        fontFamily: "Open Sans,sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": {
          color: "#939393",
        },
        "::placeholder": {
          color: "#939393",
        },
      },
      invalid: {
        iconColor: "#f41f1f",
        color: "#f41f1f",
      },
    },
  };
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.products);
  const [total, setTotal] = useState(0.0);
  const [disabled, setDisabled] = useState(true);
  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState(true);

  const onElementChange = (e) => {
    setDisabled(e.empty);
    setCardError(e.error ? e.error.message : "");
  };

  const processPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then((result) => {
        if (result.error) {
          console.log("PAYMENT RESULT: ERROR OCCURRED");
          return result.error;
        } else {
          console.log("PAYMENT RESULT: SUCCESS");
          const { paymentIntent } = result;
          const orderItems = [];
          cartItems.forEach((item) => {
            orderItems.push(item.product);
          });
          return db
            .collection("orders")
            .doc(paymentIntent.id)
            .set({
              userId: currentUser.id,
              total: total,
              date: firebase.firestore.Timestamp.fromDate(new Date()),
              products: orderItems,
            });
        }
      })
      .then((error) => {
        if (error) {
          setSucceeded(false);
          setCardError(error.message);
          setProcessing("");
        } else {
          setSucceeded(true);
          setCardError(null);
          setProcessing(false);
          dispatch(EMPTY_CART());

          history.replace("/orders");
        }
      });
  };

  const removeFromCart = (item) => {
    dispatch(REMOVE_FROM_CART(item));
    console.log("CURRENT CART SIZE ", cartItems.length);
  };

  useEffect(() => {
    const getTotal = new Promise((resolve, reject) => {
      if (cartItems.length > 0) {
        const total = calcCartTotal(cartItems);
        resolve(Math.round((total + Number.EPSILON) * 100) / 100);
      } else {
        reject();
      }
    });

    const getClientSecret = async () => {
      getTotal
        .then((cartTotal) => {
          setTotal(cartTotal);
          return new Promise((resolve, reject) => {
            if (total > 0) {
              const stripeNum =
                Math.round((total * 100 + Number.EPSILON) * 100) / 100;
              resolve(stripeNum);
            } else {
              reject();
            }
          });
        })
        .then((paymentAmt) => {
          return fetch(`${BASE_URL}/payment/${paymentAmt}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
        })
        .then((response) => response.json())
        .then((data) => {
          return new Promise((resolve, reject) => {
            if (data.clientSecret) {
              const key = data.clientSecret;
              resolve(key);
            } else {
              reject();
            }
          });
        })
        .then((key) => {
          setClientSecret(key);
        });
    };

    getClientSecret();
  }, [cartItems, total]);

  return (
    <div>
      <Navbar />
      <h1 className="checkoutTitle">Checkout</h1>
      <div className="checkoutContent">
        <div className="checkoutPage">
          <h3>Order Review</h3>
          {cartItems.map((item, index) => (
            <div className="checkoutItem" key={index}>
              <CondensedCard item={item} deleteProduct={removeFromCart} />
            </div>
          ))}

          {cartItems.length > 0 ? (
            <div>
              <h3 className="checkoutTotal">Total: ${total} </h3>
              <h3>Payment Method</h3>
            </div>
          ) : (
            <h3>
              Your cart is empty! But it doesn't have to be. Collective is your
              one-stop shop for trading! Look around and see what you can find
              at amazing deals!
            </h3>
          )}

          {cartItems.length > 0 ? (
            <form onSubmit={processPayment}>
              <CardElement options={cardOptions} onChange={onElementChange} />
              <button
                disabled={processing || disabled || succeeded}
                className={
                  processing || disabled || succeeded ? "disableBtn" : ""
                }
              >
                <span>{processing ? <p>Processing...</p> : "Checkout"}</span>
              </button>

              {cardError && <div className="cardError">{cardError}</div>}
            </form>
          ) : (
            ""
          )}
        </div>
        <div className="stripeGuide">
          <h3>Stripe Testing Card Numbers</h3>
          <div className="guideContent">
            <p>
              Payment processing is in <span>TEST MODE</span> and will not
              peform an actual charge. Use one of the following card numbers to
              test a different response.
            </p>
            <h5>
              <span>Successful: </span>4242 4242 4242 4242
              <br></br>
              <span>Card Decline: </span>4000 0000 0000 0002
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}
