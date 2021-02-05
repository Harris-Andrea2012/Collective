const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");

const SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY;

const stripe = require("stripe")(SECRET_KEY);

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true }));
app.use(express.json());

if (app.get("env") !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  console.log("AWAKE SERVER");
  res.status(200).send();
});

app.post("/payment/:total", async (req, res) => {
  const totalReceived = req.params.total;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalReceived,
    currency: "usd",
  });

  res.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(PORT, () => console.log("Collective server running!"));
