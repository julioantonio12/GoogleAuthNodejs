const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

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
  res.render("login")
});

app.post("/login", (req, res) => {
  const token = req.body.token
  console.log(token)
});