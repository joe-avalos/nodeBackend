const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const fileStore = require('session-file-store')(session)
const passport = require('passport')
const config = require('./config')

//Import Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const uploadRouter = require('./routes/uploadRouter');

//MongoDB connection
const connect = mongoose.connect(config.mongoUrl)
connect.then(() => {
  console.log('Connected!')
})
  .catch(e => console.log(e))

const app = express();

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next()
  }
  res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
//app.use(cookieParser('notSoSecret'))

app.use(session({
  store: new fileStore,
  name: 'session-id',
  secret: 'notSoSecret',
  saveUninitialized: false,
  resave: false,
}))

app.use(passport.initialize())
app.use(passport.session())

//No-auth routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
