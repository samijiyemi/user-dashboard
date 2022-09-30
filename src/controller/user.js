require('dotenv').config()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const salt = bcrypt.genSaltSync(10);


const createUserAccount = async (req, res) => {
     try {
          const { name, email, password } = req.body;

          if (!(name && email && password)) {
               req.flash('warningMessage', "please input all field");
               return res.render('register', { message: req.flash('warningMessage') });
          }

          const existingUser = await User.findOne({ email });

          if (existingUser) {
               req.flash('message', "user exist please login")
               return res.render('register', { message: req.flash('message') });
          }

          // hash password
          const hashedPassword = bcrypt.hashSync(password, salt);

          const userAccount = new User({
               name, email, password: hashedPassword
          });

          await userAccount.save();
          res.redirect('dashboard')
     } catch (err) {
          res.status(500).send({ msg: err })
     }
}

const loginUserAccount = async (req, res) => {
     try {
          const { email, password } = req.body;

          if (!(email && password)) {
               req.flash('warningMessage', "please input all field");
               return res.render('register', { message: req.flash('warningMessage') });
          }

          // check if user exists
          const userExists = await User.findOne({ email });

          if (!userExists) {
               req.flash('message', 'No user with email found... ')
               return res.render('login', { message: req.flash('message') })
          } else {
               const checkPassword = bcrypt.compareSync(password, userExists.password);
               if (!checkPassword) {
                    req.flash('message', 'incorrect password or email');
                    return res.render('login', { message: req.flash('message') });
               } else {
                    const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET, {
                         expiresIn: "20h"
                    })

                    req.header.authKey = token

                    // res.header('Authorization', 'Bearer ' + token);
                    // console.log(req.header.authKey)
                    res.redirect('/dashboard')


               }
          }

     } catch (err) {

     }
}

module.exports = {
     createUserAccount,
     loginUserAccount
}