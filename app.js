const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const sessh = require('express-session')
const fileStore = require('session-file-store')(sessh)

//Import Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

//MongoDB connection
const url = 'mongodb://localhost:27017/conFusion'
const connect = mongoose.connect(url)
connect.then(db=>{
  console.log('Connected!')
})
  .catch(e=>console.log(e))

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('notSoSecret'))

app.use(sessh({
  store: new fileStore,
  name: 'session-id',
  secret: 'notSoSecret',
  saveUninitialized: false,
  resave: false,
}))

function auth(req, res, next){
  console.log(req.session)
  
  if (!req.session.user){
    let authHeader = req.headers.authorization
    if (!authHeader) {
      let err = new Error('You are not authenticated')
      res.setHeader('WWW-Authenticate', 'Basic')
      err.status = 401
      return next(err)
    }
    let authStr = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
    let username = authStr[0]
    let password = authStr[1]
  
    if (username === 'admin' && password === 'password') {
      req.session.user = 'admin'
      next()
    } else {
      let err = new Error('Wrong user/password')
      res.setHeader('WWW-Authenticate', 'Basic')
      err.status = 401
      return next(err)
    }
  }else{
    if (req.session.user === 'admin') {
      next()
    }else{
      let err = new Error('You are not authenticated')

      err.status = 401
      return next(err)
    }
  }
}

app.use(auth)

app.use(express.static(path.join(__dirname, 'public')))


//Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
