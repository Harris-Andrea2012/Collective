import "./Navbar.css";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import firebase from "firebase/app";
import {
  faSearch,
  faShoppingCart,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { LOG_OUT } from "../../redux/reducers/authReducer";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Navbar() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const [productQuery, setProductQuery] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);

  const cartNumber = useSelector((state) => state.cart);
  const loggedIn = useSelector((state) => state.auth.loggedIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const startServer = async () => {
      await fetch(`${BASE_URL}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(console.log("SERVER REFESHED"));
    };
    startServer();
  }, []);

  const closeDelDialog = () => {
    setDeleteDialog(false);
  };

  const removeAccount = () => {
    setDeleteDialog(true);
  };
  const delAcct = async () => {
    let firebaseUser = firebase.auth().currentUser;

    let credential = firebase.auth.EmailAuthProvider.credential(
      email,
      password
    );

    await firebaseUser
      .reauthenticateWithCredential(credential)
      .then(() => {
        return db
          .collection("orders")
          .where("userId", "==", firebaseUser.uid)
          .get();
      })
      .then((orderDocs) => {
        orderDocs.forEach((doc) => {
          doc.ref.delete();
        });
        console.log("ORDER HISTORY DELETED");

        return db
          .collection("products")
          .where("userId", "==", firebaseUser.uid)
          .get();
      })
      .then((productResults) => {
        productResults.forEach((doc) => {
          doc.ref.delete();
        });
        console.log("SELLER PRODUCTS DELETED");
        return db.collection("users").doc(firebaseUser.uid).delete();
      })
      .then(() => {
        console.log("DB USER DELETED");
        return firebaseUser.delete();
      })
      .then(() => {
        console.log("FIREBASE USER DELETED");
        setDeleteDialog(false);
        dispatch(LOG_OUT());
        window.alert("User account successfully deleted.");
      })
      .catch((err) => {
        console.log(err);
        window.alert(err.message);
      });
  };

  const showProducts = () => {
    if (productQuery === "") {
      db.collection("products")
        .limit(50)
        .get()
        .then((queryResult) => {
          const products = [];
          queryResult.forEach((doc) => {
            products.push({
              productId: doc.id,
              product: doc.data(),
            });
          });

          history.push({
            pathname: "/products",
            state: { items: products },
          });
        });
    } else {
      db.collection("products")
        .where("keywords", "array-contains", productQuery.toLowerCase())
        .get()
        .then((queryResult) => {
          const products = [];
          queryResult.forEach((doc) => {
            products.push({
              productId: doc.id,
              product: doc.data(),
            });
          });

          history.push({
            pathname: "/products",
            state: { items: products },
          });
        });
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const logout = () => {
    dispatch(LOG_OUT());
    window.alert("Logged out successfully!");
  };

  const goToCart = () => {
    history.push("/cart");
  };

  const goToOrders = () => {
    if (loggedIn === true) {
      history.push("/orders");
    } else {
      history.push({
        pathname: "/login",
        state: { redirectUrl: "/orders" },
      });
    }
  };
  return (
    <div className="navBar">
      {deleteDialog === true ? (
        <div className="delDialogContainer">
          <div className="delDialog">
            <button className="closeModal" onClick={closeDelDialog}>
              X
            </button>

            <h3>Are you sure?</h3>
            <p>
              Deleting your account erases all your customer information
              including order history.
            </p>
            <label htmlFor="email">Please confirm your email.</label>
            <input
              type="text"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Please confirm your password.</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="delAcctBtn" onClick={delAcct}>
              Delete
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      <Link to="/" className="nav-link">
        <h1 className="nav-logo">Collective</h1>
      </Link>

      <div className={"nav-search" + (showMenu ? "" : " hide-nav")}>
        <input type="text" onChange={(e) => setProductQuery(e.target.value)} />

        <button type="button" onClick={showProducts}>
          <FontAwesomeIcon
            icon={faSearch}
            color="white"
            className="searchIcon"
          />
        </button>
      </div>

      <div className={"nav-links" + (showMenu ? "" : " hide-nav")}>
        <ul>
          {loggedIn === true ? (
            <li>
              <div onClick={removeAccount} className="nav-link nav-nav">
                Delete Account
              </div>
            </li>
          ) : (
            ""
          )}
          {loggedIn === true ? (
            <li>
              <Link to="" className="nav-link nav-nav" onClick={logout}>
                Logout
              </Link>
            </li>
          ) : (
            ""
          )}
          <li>
            <div onClick={goToOrders} className="nav-link nav-nav">
              Orders
            </div>
          </li>

          <li>
            <div className="basket" onClick={goToCart}>
              <FontAwesomeIcon
                icon={faShoppingCart}
                color="#4B5846"
                className="cart-icon"
              />
              <h3>{cartNumber.products.length}</h3>
            </div>
          </li>
        </ul>
      </div>
      <div className="hamburger">
        <FontAwesomeIcon
          icon={faBars}
          color="#4B5846"
          size="2x"
          onClick={toggleMenu}
        />
      </div>
    </div>
  );
}
