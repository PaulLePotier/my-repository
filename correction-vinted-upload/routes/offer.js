const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary");
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../middlewares/isAuthenticated");
const Offer = require("../models/Offer");

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      // récupérer les fichiers avec req.files
      // console.log("files =>", req.files.picture);
      // console.log("body =>", req.body);
      // {
      //   title: 'pantalon',
      //   description: 'presque neuf',
      //   price: '5',
      //   condition: 'neuf',
      //   city: 'Paris',
      //   brand: 'H&M',
      //   size: 'L',
      //   color: 'rouge'
      // }

      const { title, description, price, condition, city, brand, size, color } =
        req.body;

      // créer le document correspondant à l'offre
      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          {
            MARQUE: brand,
          },
          {
            TAILLE: size,
          },
          {
            ÉTAT: condition,
          },
          {
            COULEUR: color,
          },
          {
            EMPLACEMENT: city,
          },
        ],
        owner: req.user,
      });
      console.log("newOffer =>", newOffer);
      // envoyer l'image à cloudinary
      if (req.files) {
        const convertedPicture = convertToBase64(req.files.picture);
        // console.log(convertedPicture);
        const uploadResult = await cloudinary.uploader.upload(
          convertedPicture,
          {
            folder: `/vinted/offers/${newOffer._id}`,
          }
        );
        // console.log(uploadResult);
        // inclure l'image dans notre nouveau document (donc l'offre)
        newOffer.product_image = uploadResult;
      }

      console.log(newOffer);
      // sauvegardera l'offre
      await newOffer.save();
      return res.status(201).json(newOffer);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
