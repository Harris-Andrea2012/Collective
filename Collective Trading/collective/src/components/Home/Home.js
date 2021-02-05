import "./Home.css";
import banner from "../../images/banner.jpg";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import ProductFeature from "../ProductFeature/ProductFeature";

import { db } from "../../firebase";
import firebase from "firebase/app";

export default function Home() {
  const history = useHistory();
  const authorized = useSelector((state) => state.auth.loggedIn);

  const [collectiveProducts, setCollectiveProducts] = useState([]);
  const [featureProducts, setFeatureProducts] = useState([]);

  useEffect(() => {
    const getFeatureProducts = () => {
      db.collection("products")
        .orderBy(firebase.firestore.FieldPath.documentId())
        .limit(15)
        .get()

        .then((queryResult) => {
          const products = [];

          queryResult.forEach((doc) => {
            products.push({
              productId: doc.id,
              product: doc.data(),
            });
          });

          setFeatureProducts(products);
        })
        .catch((error) => console.log(error));
    };

    const getCollectiveBrand = () => {
      db.collection("products")
        .where("seller", "==", "Collective")
        .limit(15)
        .get()
        .then((queryResult) => {
          const products = [];

          queryResult.forEach((doc) => {
            products.push({
              productId: doc.id,
              product: doc.data(),
            });
          });

          setCollectiveProducts(products);
        })
        .catch((error) => console.log(error));
    };

    getCollectiveBrand();
    getFeatureProducts();
  }, []);

  const goToSeller = () => {
    if (authorized === true) {
      history.push("/seller");
    } else {
      history.push({
        pathname: "/login",
        state: { redirectUrl: "/seller" },
      });
    }
  };
  return (
    <div className="home">
      <Navbar />
      <div className="banner" style={{ backgroundImage: `url(${banner})` }}>
        <h1>Collective</h1>
        <h3>The World's #1 Fake Trading Site</h3>
      </div>

      <ProductFeature title="Featured Products" products={featureProducts} />
      <ProductFeature
        title="Collective Products"
        products={collectiveProducts}
      />

      <h2>Sell on Collective</h2>

      <button className="seller-btn" type="button" onClick={goToSeller}>
        Become a Seller
      </button>
    </div>
  );
}
