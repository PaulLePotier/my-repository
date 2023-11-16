const express = require("express");
const mongoose = require("mongoose");
// const fileUpload = require("express-fileupload"); //Necessaire ici ?
// const User = require("./models/User"); // PAS BESOIN ICI ?

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/Vinted");

const userRoutes = require("./routes/user");
app.use(userRoutes);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

app.all("*", (req, res) => {
  res.status(401).json({ message: "pas de route" });
});

app.listen(3000, () => {
  console.log("server started");
});

// COmment enlever le 0
// comment afficher un certains nombre de chose d'un groupe
// Comment verifier si identifiant existe deja
