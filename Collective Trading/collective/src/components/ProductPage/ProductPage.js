import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductPage.css";

import Navbar from "../Navbar/Navbar";
import ProductResults from "./ProductResults";

export default function ProductPage() {
  const location = useLocation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(location.state.items);
  }, [location]);

  return (
    <div>
      <Navbar />
      <div className="products">
        <ProductResults products={items} />
      </div>
    </div>
  );
}
