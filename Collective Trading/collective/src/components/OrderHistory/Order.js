import "./OrderHistory.css";
import React from "react";
import CondensedCard from "../ProductCard/CondensedCard";

export default function Order({ order }) {
  return (
    <div className="customerOrder">
      <div className="orderDetails">
        <h3>Order Number: {order.orderId}</h3>
        <p>
          <span>Order Date: </span>
          {order.order.date.toDate().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p>
          <span>Total:</span> ${order.order.total}
        </p>
      </div>

      <div className="orderItems">
        <h3>Order Items</h3>
        {order.order.products.map((product, index) => (
          <div className="orderItem" key={index}>
            <CondensedCard item={product} orderHistory={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
