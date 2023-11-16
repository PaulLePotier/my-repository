const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();

mongoose.connect("mongodb://localhost:27017/vinted");

app.use(express.json());

app.get("/", (req, res) => {
  try {
    return res.status(200).json("Bienvenue sur l'API Vinted !");
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

const userRoutes = require("./routes/user");
app.use(userRoutes);

app.all("*", (req, res) => {
  return res.status(404).json("Not found");
});

app.listen(3000, () => {
  console.log("Server started");
});
