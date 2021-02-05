/**
 *
 *
 * MAKE SURE TO
 * OH....AND SECURITY RULESS
 *
 */

import "./Seller.css";
import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import CondensedCard from "../ProductCard/CondensedCard";
import { db, storage } from "../../firebase";
import { makeKeywords } from "../../utility";
import { useSelector } from "react-redux";

export default function Seller() {
  const user = useSelector((state) => state.auth.user);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productImg, setProductImg] = useState(null);
  const [inventoryChange, setInventoryChange] = useState(null);

  const [products, setProducts] = useState([]);

  const createProduct = async () => {
    const searchTerms = makeKeywords(productName);
    const storageRef = storage.ref();
    const fileRef = storageRef.child(productImg.name);
    await fileRef.put(productImg);
    const url = await fileRef.getDownloadURL();

    db.collection("products")
      .add({
        name: productName,
        price: productPrice,
        imageName: productImg.name,
        image: url,
        seller: user.name,
        keywords: searchTerms,
        userId: user.id,
      })
      .then((docRef) => {
        console.log("Document written TO DB: ");
        setInventoryChange(true);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const deleteProduct = async (item) => {
    console.log(item.product.imageName);
    const storageRef = storage.ref();
    const productImgUrl = storageRef.child(item.product.imageName);

    productImgUrl
      .delete()
      .then(console.log("Product Image Removed from Storage"))
      .catch((error) => {
        console.log(error);
      });

    await db
      .collection("products")
      .doc(item.productId)
      .delete()
      .then(() => {
        console.log("DOC DELETED");
        setInventoryChange(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const updateProductDisplay = async () => {
      if (inventoryChange === true || inventoryChange === null) {
        db.collection("products")
          .where("seller", "==", user.name)
          .get()
          .then((queryResult) => {
            const products = [];
            queryResult.forEach((doc) => {
              products.push({
                productId: doc.id,
                product: doc.data(),
              });
            });

            setProducts(products);
            setInventoryChange(false);
            console.log("DISPLAY UPDATED");
          });
      }
    };
    updateProductDisplay();
  }, [user.name, inventoryChange]);

  return (
    <div>
      <Navbar />
      <div className="sellerPage">
        <h1>Seller's Page</h1>
        <div className="addProduct-container">
          <h2>Add a Product</h2>
          <label htmlFor="name">Product Name</label> <br></br>
          <input
            type="text"
            id="name"
            name="name"
            required
            onChange={(e) => setProductName(e.target.value)}
          />{" "}
          <br></br>
          <label htmlFor="price">Product Price</label> <br></br>
          <input
            type="number"
            id="price"
            name="price"
            required
            min=".1"
            step=".1"
            onChange={(e) => setProductPrice(parseFloat(e.target.value))}
          />{" "}
          <br></br>
          <label htmlFor="image">Product Image</label> <br></br>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            required
            onChange={(e) => setProductImg(e.target.files[0])}
          />
          <br></br>
          <button type="button" onClick={createProduct}>
            Submit
          </button>
        </div>
        <div className="sellerProducts">
          <h2>Your Products</h2>

          {products.map((product, index) => (
            <div key={index}>
              <CondensedCard item={product} deleteProduct={deleteProduct} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
