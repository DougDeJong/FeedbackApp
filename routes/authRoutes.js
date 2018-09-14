const express    = require('express');
const router     = express.Router();
const User       = require('../models/user')
const bcrypt     = require('bcryptjs')
const bcryptSalt = 10;
const nodemailer = require('nodemailer')



 const passport = require('passport');
const ensureLogin = require("connect-ensure-login");




// begin routes


// signup

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
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
  const email = req.body.useremail

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
      email
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: req.flash('error') });
      } else {
        // console.log('@#$!@#$!@#$!@#$!@#$!@#$!@#$')
        // console.log('user')
        // transporter.sendMail({
        //   from: 'Cool Movie Site ',
        //   to: email, 
        //   subject: 'Welcome To The #1 Fake Movie Site', 
        //   text: `Hi ${username}, welcome to Doug's Movies! Hope you enjoy the show ;)`,
        //   html: `Hi ${username}, welcome to Doug's Movies! Hope you enjoy the show ;)`,
        // })
        // .catch((err)=>{
        //   console.log(err)
        // })
        res.redirect("/");
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
  successRedirect: "/",
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





  // exports


module.exports = router;