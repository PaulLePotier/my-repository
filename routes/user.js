const express = require("express");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const router = express.Router();

const User = require("../models/User");
const isAuthenticated = require("../middleware/auth");

//TEST DE ROUTE D'AUTENTIFICATION
router.get("/users", isAuthenticated, async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/signup", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res.json({ message: "Ce mail est deja utilisé" });
    } else {
      if (req.body.username) {
        const password = req.body.password;
        const salt = uid2(16);
        const hash = SHA256(password + salt).toString(encBase64);
        const token = uid2(16);
        const newUser = new User({
          account: {
            username: req.body.username,
          },
          email: req.body.email,
          // password: req.body.password, NE JAMAIS ENVOYE LE MDP
          newsletter: req.body.newsletter,
          token: token,
          hash: hash,
          salt: salt,
        });

        newUser.save();
        res.json({
          _id: newUser._id,
          token: token,
          account: {
            username: req.body.username,
          },
        });
      } else {
        res.json({
          message: "username manquant",
        });
      }
    }
  } catch (error) {
    console.log({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  //RAJOUTER UN TRY CATCH // RAJOUTER UN IF (USERTOSEARCH) pour savoir si il existe
  const userToSearch = await User.find({ email: req.body.email });
  const hashToGenerate = SHA256(
    req.body.password + userToSearch[0].salt //on peut aussi créer avant un saltedpassword = req.body.password + userToSearch[0].salt
  ).toString(encBase64);
  //   res.json(hashToGenerate); //Comment enlever tableau ?
  if (hashToGenerate === userToSearch[0].hash) {
    res.json({
      id: userToSearch[0].id,
      email: userToSearch[0].email,
      token: userToSearch[0].token,
      account: userToSearch[0].account,
    });
  } else {
    res.json({ message: "mot de passse incorrect" });
  }
});

module.exports = router;
