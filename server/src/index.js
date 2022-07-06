const express = require("express");
const cors = require("cors");

const connect = require("./configs/db")

const dotenv = require("dotenv");
const app = express();
app.use(express.json());

let port = process.env.PORT || 2344;

const paymentRoutes = require("./controllers/payment");


const productApi = require("./controllers/ProductsController");

const passport = require("./configs/google-oauth");


app.use(cors());

const { register, login, newToken } = require("./controllers/auth.controller");

// register
app.post("/register", register);
// .login
app.post("/login", login);



app.use("/api/payment/", paymentRoutes);

app.use("/product", productApi);

app.get("/api/admin");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
  }),
  (req, res) => {
    const { user } = req;
    console.log("user", user);
    const token = newToken(user);
    console.log("user", user);
    return res.send({ user, token });
  }
);

app.listen(port, async (req, res) => {
  try {
    await connect();
  } catch (err) {
    console.error(err.message);
  }
  console.log("listening on port 2345");
  console.log("working");
});