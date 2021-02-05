import "./CondensedCard.css";
import React from "react";
import { useEffect, useState } from "react";

export default function CondensedCard({ item, deleteProduct, orderHistory }) {
  const [product, setProduct] = useState(null);
  const truncate = (str, n) => {
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  useEffect(() => {
    if (orderHistory) {
      setProduct(item);
    } else {
      const { product } = item;
      setProduct(product);
    }
  }, [item, orderHistory]);

  return (
    <div className={orderHistory ? "orderHistoryCard" : "condensedCard"}>
      <div className="img-container">
        <img src={product?.image} alt="Product" />
      </div>
      <div className="productDets">
        <h5>{product ? truncate(product.name, 70) : ""}</h5>
        <p>${product?.price}</p>
        {orderHistory ? (
          ""
        ) : (
          <button type="button" onClick={() => deleteProduct(item)}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
