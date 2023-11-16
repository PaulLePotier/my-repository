// const isAuthenticated = async (req, res, next) => {
//   // toute la logique d'authentification : récup du token, replace, findOne, etc...
//   // console.log(">>>>", req.headers.authorization); // Bearer Agr72yRiCUBz6ihiXCFxHBBg
//   // const prepToken = req.headers.authorization;
//   //   const token = req.headers.authorization.replace("Bearer ", "");
//   //   console.log(token); // Agr72yRiCUBz6ihiXCFxHBBg
//   // une fois le token "délesté" de "Bearer ", vous pouvez recherché votre utilisateur dans la BDD grâce à un petit findOne :
//   // const userFound = User.findOne({ token: token });
//   if (req.headers.authorization) {
//   const userToken = req.headers.authorization.replace("Bearer ", "");
//   const user = await User.findOne({ token: userToken }).select("account");

//   if (user) {
//     //J'ai remplacé userFound par token
//     // const token = req.headers.authorization.replace("Bearer ", "");
//     req.user = user;
//     console.log(">>>>", token);
//     next();
//   } } 
//   else {
//     return res.status(401).json("Unauthorized");
//   }
// };

// module.exports = isAuthenticated;

const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    // récupérer le token envoyé dans req.headers.authorization
    const userToken = req.headers.authorization.replace("Bearer ", "");
    // console.log("token =>", userToken); // XGslDtgLQoZWn1XJDkBmxOXj

    // récupérer le owner de l'offre grâce au token
    const user = await User.findOne({ token: userToken }).select("account");
    // console.log("user =>", user);
    if (!user) {
      return res.status(401).json("Unauthorized");
    } else {
      req.user = user;
      return next();
    }
  } else {
    return res.status(401).json("Unauthorized");
  }
};

module.exports = isAuthenticated;
