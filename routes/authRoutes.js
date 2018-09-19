const express    = require('express');
const router     = express.Router();
const User       = require('../models/user')
const bcrypt     = require('bcryptjs')
const bcryptSalt = 10;
const nodemailer = require('nodemailer')
const AWSupload = require('../config/aws.js')
const multer = require('multer')
const multerS3 = require('multer-s3')



const passport = require('passport');
const ensureLogin = require("connect-ensure-login");




// begin routes


// signup

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", AWSupload.single('userphoto'), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.MAILUSERNAME,
      pass: process.env.MAILPASS, 
    }
    // add username and email from primary FEEDBACK mail account
  });
  console.log(req.file);
  const email = req.body.useremail;

  
  if (username === "" || password === "") {
    res.render("auth/signup", { message: req.flash('error')  });
    return;
  }
  
  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("auth/signup", { message: req.flash('error') });
      return;
    }
    
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    
    const newUser = new User({
      username,
      password: hashPass,
      email,
    });
    
    if (req.file){
      newUser.image = `https://s3.amazonaws.com/main-demo-container5454/${req.file.originalname}`;
  
    }
    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: req.flash('error') });
      } else {
        
        res.redirect("/user/index");
      }
    })
  })
  .catch(error => {
    next(error)
  })
});


// passport login


router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash('error') });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/user/index",
  failureRedirect: "/login",
  failureFlash: true,
  successFlash: true,
  passReqToCallback: true
}));



// passport logout


router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      // cannot access session here
      res.redirect("/login");
    });
  });


  // passport test


  router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("private", { user: req.user });
  });




  // exports


module.exports = router;