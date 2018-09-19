const passport = require('passport');
const ensureLogin = require("connect-ensure-login");
const express = require('express');
const router  = express.Router();
const Track       = require('../models/track')
const AWSupload = require('../config/aws.js')
const multer = require('multer')
const multerS3 = require('multer-s3')


router.get('/tracks/upload', (req, res, next)=> {
  res.render('tracks/upload');
})

router.post('/repos/create', AWSupload.single('repoimage'), (req, res, next)=> {
  Repo.create({
    name: req.body.reponame,
    description: req.body.repodescription,
    creator: req.user.id,
    trackList: [],
    repoImage: `https://s3.amazonaws.com/main-demo-container5454/${req.file.originalname}`

  })
  .then((ret)=> {
    console.log(ret);
    User.findByIdAndUpdate(req.user.id, 
      {$push: {repos: ret.id}

    })
    .then((ret2)=> {
      res.redirect('../user/index')
    })

  })
})

module.exports = router;