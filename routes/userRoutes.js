const passport = require('passport');
const ensureLogin = require("connect-ensure-login");
const express = require('express');
const router  = express.Router();
const User       = require('../models/user')


router.get('/user/index', (req, res, next) => {
  res.render('user/index');
});

module.exports = router;