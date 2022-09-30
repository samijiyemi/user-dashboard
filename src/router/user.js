const express = require('express')
const router = express.Router();

const { createUserAccount, loginUserAccount } = require('../controller/user');

router.route('/login').post(loginUserAccount);
router.route('/register').post(createUserAccount);


module.exports = router;


