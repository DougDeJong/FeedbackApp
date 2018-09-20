const passport = require('passport');
const ensureLogin = require("connect-ensure-login");
const express = require('express');
const router  = express.Router();
const Repo       = require('../models/trackrepo')
const AWSupload = require('../config/aws.js')
const multer = require('multer')
const multerS3 = require('multer-s3')
const User       = require('../models/user')
const Track     = require('../models/track')
const mongoose = require("mongoose");



router.get('/repos/new', (req, res, next)=> {
  res.render('repos/new');
})

router.get('/repos/ownerview', (req, res, next)=> {
  Repo.find({creator: req.user.id})
  .populate('trackList')
  .then((ret)=> {
    res.render('repos/ownerview', {repos: ret});

  })
  
})



router.post('/repos/create', AWSupload.single('repoimage'), (req, res, next)=> {

  const newRepo = new Repo ({
    name: req.body.reponame,
    description: req.body.repodescription,
    creator: req.user.id,
    trackList: [],

  })
 

  if (req.file){
    newRepo.repoImage = `https://s3.amazonaws.com/main-demo-container5454/${req.file.originalname}`;
    
  }
  newRepo.save((ret) =>{
    console.log(ret);
    User.findByIdAndUpdate(req.user.id, 
      {$push: {repos: newRepo.id}})
  .then((ret)=> {
    res.redirect('../user/index')
      
    })
 })
})



module.exports = router;