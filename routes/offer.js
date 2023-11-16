const express = require("express");
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../middleware/auth");
const mongoose = require("mongoose");

// const uid2 = require("uid2");
// const SHA256 = require("crypto-js/sha256");
// const encBase64 = require("crypto-js/enc-base64");
// const app = express()

const router = express.Router();

const Offer = require("../models/Offer");
const User = require("../models/User"); // EST CE NECESSAIRE

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

// convertToBase64(req.files.pictures[0]);

router.get("/offer/:id", async (req, res) => {
  try {
    const offers = await Offer.findById(req.params.id);
    // ESSYAGER DE RAJOUTER CA .populate("owner")
    res.json(offers);
  } catch (error) {
    console.log({ message: error.message });
  }
});

router.get("/offers", async (req, res) => {
  try {
    const offers = await Offer.find(
      { product_name: req.query.title } && {
          product_price: { $gte: req.query.priceMin },
        } && {
          product_price: { $lte: req.query.priceMax },
        }
      //  && { product_description: req.query.description }
    );
    //     $or: [
    //       { product_name: req.query.title },
    //       { product_description: req.query.description },
    //     ],
    //   },
    //   function (err, user) {
    //     if (err) {
    //       res.send(err);
    //     }
    //     console.log(user);
    //     res.json(user);
    //   }
    // );

    res.json(offers);

    // }
  } catch (error) {
    console.log({ message: error.message });
  }
});

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      //   res.json("salut");
      const pictureToUpload = req.files.picture;
      const resultImage = await cloudinary.uploader.upload(
        convertToBase64(pictureToUpload)
      );

      //POUR UPLOADER LES SPECS DU PRODUITS AUTRES QUE LA PHOTO

      //AUTHENTIFIER LE GARS
      // const findUser = await User.findOne({ token: req.user }); //voir correction ON peut faire mettre plutot la variable token: req.headers.authorization.replace("Bearer ", ""); et ajouter .select("account")
      // console.log("RESULTATTT >>>", findUser);

      //   console.log(req.user);

      const newOffer = await new Offer({
        product_name: req.body.title,
        product_description: req.body.description,
        product_price: 12,
        product_price: req.body.price,
        product_details: [
          {
            MARQUE: req.body.brand,
          },
          {
            TAILLE: req.body.size,
          },
          {
            ÉTAT: req.body.condition,
          },
          {
            COULEUR: req.body.color,
          },
          {
            EMPLACEMENT: req.body.city,
          },
        ],
        product_image: resultImage, //METTRE TOUT L'OBJET Image donc enlever .secure_url
        owner: req.user,
      });
      await newOffer.populate("owner");
      await newOffer.save();

      res.json(newOffer); //> C'EST UN OBJET VIDE
    } catch (error) {
      console.log({ message: error.message });
    }
  }
);

module.exports = router;
