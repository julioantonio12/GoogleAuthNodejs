const cookieParser = require("cookie-parser");
const express = require("express");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 5000;

//Google Auth
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

//Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const token = req.body.token;
  console.log(token);

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    console.log(payload);
    const userid = payload["sub"];
  }
  verify()
    .then(() => {
      res.cookie("SESSION-TOKEN", token);
      res.send("success");
    })
    .catch(console.error);
});

app.get("/dashboard", validateAuthenticated, (req, res) => {
  let user = req.user;
  res.render("dashboard", { user });
});

app.get("/protected-route", validateAuthenticated, (req, res) => {
  res.render("protected-route");
});

app.get("/logout", (req, res) => {
  res.clearCookie("SESSION-TOKEN");
  res.redirect("/login");
});

function validateAuthenticated(req, res, next) {
  const token = req.cookies["SESSION-TOKEN"];
  let user = {};
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    user.name = payload.name;
    user.email = payload.email;
    user.picture = payload.picture;
  }
  verify()
    .then(() => {
      req.user = user;
      next();
    })
    .catch((err) => {
      res.redirect("/login");
    });
}
