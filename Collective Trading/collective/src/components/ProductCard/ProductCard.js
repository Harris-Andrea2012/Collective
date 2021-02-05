import "./ProductCard.css";
import { useSelector, useDispatch } from "react-redux";
import { ADD_TO_CART } from "../../redux/reducers/cartReducer";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const truncate = (str, n) => {
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  const { name, price, image } = product.product;
  return (
    <div className="productCard">
      <div className="productImg">
        <img src={image} alt="ProductImage" />
      </div>

      <div>
        <h5>{truncate(name, 30)}</h5>
        <p>${price}</p>
      </div>

      <div className="button-wrap">
        <button
          className="cartAdd"
          type="button"
          onClick={() => {
            dispatch(ADD_TO_CART(product));
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
