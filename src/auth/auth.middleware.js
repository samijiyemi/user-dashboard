require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const auth = async (req, res, next) => {
     try {
          const authHeader = req.header.authKey;
          const token = authHeader
          jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
               if (err) return res.status(400).send(err)

               req.user = user
               next()
          });



     } catch (err) {
          res.status(500).send("Not authorized")
     }
}

const adminOnly = async (req, res, next) => {
     try {
          const authHeader = req.header.authKey;
          const verified = jwt.verify(authHeader, process.env.JWT_SECRET);

          await User.findById(verified.id, (err, user) => {
               if (!user.seller) {
                    return res.send("not authorized")
               }

               req.user = user
               next()
          });
     } catch (err) {

     }
}

module.exports = {
     auth, adminOnly
};