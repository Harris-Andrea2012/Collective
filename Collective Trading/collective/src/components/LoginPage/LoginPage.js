import "./LoginPage.css";
import { useState } from "react";
import Img from "../../images/login.jpg";
import { auth, db } from "../../firebase";
import { useHistory, useLocation } from "react-router-dom";
import { LOG_IN } from "../../redux/reducers/authReducer";
import { useDispatch } from "react-redux";
import { displayLoginError } from "../../utility";

export default function LoginPage() {
  const location = useLocation();
  const dispatch = useDispatch();

  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    let authError;
    const cred = await auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        authError = error;
      });

    if (authError) {
      window.alert(displayLoginError(authError));
    } else {
      const { user } = cred;
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          const foundUser = doc.data();
          dispatch(
            LOG_IN({
              id: user.uid,
              name: foundUser.name,
              email: foundUser.email,
            })
          );
          history.push(location.state.redirectUrl);
        });
    }
  };
  const goCreateAcct = () => {
    history.push({
      pathname: "/signUp",
      state: { redirectUrl: location.state.redirectUrl },
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
      <h2>Sign In</h2>
      <p>Sign in with your email and a password.</p>
      <label htmlFor="email">Email</label> <br></br>
      <input
        type="text"
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
        <button type="buton" className="loginBtn" onClick={signIn}>
          Sign In
        </button>

        <button
          type="buton"
          className="loginBtn acctBtn"
          onClick={goCreateAcct}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
