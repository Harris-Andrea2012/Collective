import "./LoginPage.css";
import { useState } from "react";
import Img from "../../images/signUp.jpg";
import firebase from "firebase/app";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { LOG_IN } from "../../redux/reducers/authReducer";
import { db } from "../../firebase";
import { displayLoginError } from "../../utility";

export default function SignUp() {
  const location = useLocation();

  const dispatch = useDispatch();
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        return db.collection("users").doc(cred.user.uid).set({
          name: name,
          email: email,
        });
      })
      .then(() => {
        const fireUser = firebase.auth().currentUser;

        const user = {
          id: fireUser.uid,
          name,
          email,
        };
        dispatch(LOG_IN(user));
        console.log("USER IN DB");
        history.push(location.state.redirectUrl);
      });
  };

  const returnHome = () => {
    history.push("/");
  };
  return (
    <div className="loginPage">
      <div className="login-logo" style={{ backgroundImage: `url(${Img})` }}>
        <h1 onClick={returnHome}>Collective</h1>
      </div>
      <h2>Sign Up</h2>
      <label htmlFor="name">Name</label> <br></br>
      <input
        type="text"
        id="name"
        name="name"
        required
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <label htmlFor="email">Email</label> <br></br>
      <input
        type="email"
        id="email"
        name="email"
        required
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />{" "}
      <br></br>
      <label htmlFor="password">Password</label> <br></br>
      <input
        type="password"
        id="password"
        name="password"
        required
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />{" "}
      <br></br>
      <div className="loginButtons">
        <button type="buton" className="loginBtn" onClick={signUp}>
          Sign Up
        </button>
      </div>
    </div>
  );
}
