require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const bcrypt       = require('bcryptjs')
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('./models/user');
const AWS = require('aws-sdk');
const uploadAWS = require('./config/aws')
const fs = require('fs');

const flash = require("connect-flash");
// const uploadCloud = require('./config/cloudinary.js')


mongoose
  .connect('mongodb://localhost/feedbackapp', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// session

app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 6000000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60 * 60 * 24 * 1
  })
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  // console.log(user)
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// flash

app.use(flash());

// local strat

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// AWS Setup


// //configuring the AWS environment
// AWS.config.update({
//   accessKeyId: process.env.AWSKEY,
//   secretAccessKey: process.env.AWSSEC
// });

// var s3 = new AWS.S3();

//configuring parameters
// var params = {
// Bucket: 'main-demo-container5454',
// Body : fs.createReadStream(filePath),
// Key : "folder/"+Date.now()+"_"+path.basename(filePath)
// };

// s3.upload(params, function (err, data) {
// //handle error
// if (err) {
//   console.log("Error", err);
// }

// //success
// if (data) {
//   console.log("Uploaded in:", data.Location);
// }
// });


// END AWS



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);

const trackRoutes = require('./routes/trackRoutes');
app.use('/', trackRoutes);

const repoRoutes = require('./routes/repoRoutes');
app.use('/', repoRoutes);


// const trackRoutes = require('./routes/tracks');
// app.use('/', trackRoutes);

// const movieRoutes = require('./routes/repos');
// app.use('/', movieRoutes );

// const collectionRoutes = require('./routes/collections')
// app.use('/', collectionRoutes );

// const axiosRoute = require('./routes/axios')
// app.use('/', axiosRoute );

// const routesApi = require('./routes/apiroutes')
// app.use('/api', routesApi)





module.exports = app;
