const passport = require('passport');
const ensureLogin = require("connect-ensure-login");
const express = require('express');
const router  = express.Router();
const Track       = require('../models/track')
const AWSupload = require('../config/aws.js')
const multer = require('multer')
const multerS3 = require('multer-s3')
const Repo      = require('../models/trackrepo')
const mongoose = require("mongoose")
const bodyParser = require('body-parser');


// Route for Upload page
router.get('/tracks/upload', (req, res, next)=> {
  Repo.find({creator: req.user.id})
  .then((ret)=>{
    res.render('tracks/upload', {repos: ret});

  })
})


// Route for the actual file Upload process

router.post('/tracks/create', AWSupload.single('audiofile'), (req, res, next)=> {
  const theRepo = req.body.trackrepo;
  Track.create({
    name: req.body.trackname,
    description: req.body.trackdescription,
    creator: req.user.id,
    dateRecorded: req.body.daterecorded,
    repoName: theRepo,
    audioFile: `https://s3.amazonaws.com/main-demo-container5454/${req.file.originalname}`

  })
  .then((ret)=> {
    console.log(ret);
    Repo.findByIdAndUpdate(theRepo, 
      {$push: {trackList: ret}

    })
    .then((ret2)=> {
      res.redirect('../user/index')
    })

  })
})

// sending to the edit page
router.get('/tracks/edit/:id', (req, res, next)=> {
  Track.findById(req.params.id)

  .then((ret)=> {
    Repo.find()
    .then((theRepos)=>{
      res.render('tracks/edit', {track: ret, repos: theRepos});
    })
  })
})

// actually updating
router.post('/tracks/update/:id', (req, res, next)=> {
  console.log(req.body)
  let theUpdate = {
    name: req.body.trackname,
    description: req.body.trackdescription,
    dateRecorded: req.body.dateRecorded,

  }
  console.log(theUpdate)
  Track.findByIdAndUpdate(req.params.id, theUpdate)
  .then((ret)=>{
    res.redirect('/repos/ownerview')
  })
})

// deleting 

router.get('/tracks/delete/:id', (req, res, next)=> {
  Track.findByIdAndRemove(req.params.id)
  .then((ret)=> {
    res.redirect('/repos/ownerview')
  })
  .catch(next)
  })


module.exports = router;