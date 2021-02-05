import "./OrderHistory.css";
import Navbar from "../Navbar/Navbar";
import React from "react";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Order from "./Order";
import { useHistory } from "react-router-dom";

export default function OrderHistory() {
  const user = useSelector((state) => state.auth.user);
  const [orders, setOrders] = useState([]);
  const history = useHistory();
  const goToLogin = () => {
    history.push({
      pathname: "/login",
      state: { redirectUrl: "/orders" },
    });
  };

  useEffect(() => {
    const getOrders = async () => {
      if (user?.id) {
        db.collection("orders")
          .where("userId", "==", user.id)
          .get()
          .then((results) => {
            const receievedOrders = [];
            results.forEach((doc) => {
              receievedOrders.push({
                orderId: doc.id,
                order: doc.data(),
              });
            });
            setOrders(receievedOrders);
          })
          .catch((err) => console.log(err));
      }
    };
    getOrders();
  }, [user?.id]);
  return (
    <div>
      <Navbar />
      <div className="orderHistory">
        <h1>Your Orders</h1>
        {user ? (
          orders?.length > 0 ? (
            orders?.map((order, index) => (
              <div className="orderContainer" key={index}>
                <Order order={order} />
              </div>
            ))
          ) : (
            <div className="nullUserAlternative">
              <p>
                Hmm...no orders yet. But it doesn't have to be. Collective is
                your one-stop shop for trading! Look around and see what you can
                find at amazing deals!
              </p>
            </div>
          )
        ) : (
          <div className="nullUserAlternative">
            <p>Looks like your not logged in. Log in to view your orders.</p>
            <button onClick={goToLogin}>Go to Login</button>
          </div>
        )}
      </div>
    </div>
  );
}
