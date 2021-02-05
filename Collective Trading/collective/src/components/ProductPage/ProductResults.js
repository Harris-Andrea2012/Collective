import React from "react";
import "./ProductPage.css";
import ProductCard from "../ProductCard/ProductCard";

export default function ProductResults({ products }) {
  return (
    <div className="productResults">
      {products.map((product, index) => (
        <div key={index}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
