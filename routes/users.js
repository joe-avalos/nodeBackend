const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')

const router = express.Router()

const User = require('../models/user')

router.use(bodyParser.json())
/* GET users listing. */
router.get('/', function (req, res) {
  res.send('respond with a resource')
});

router.post('/signup', (req, res) => {
  User.register(
    new User({username: req.body.username}),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500
        res.json({err: err})
      } else {
        passport.authenticate('local')(req, res, () => {
          res.json({success: true, status: 'Registration successful!'})
        })
      }
    })
})

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({success: true, status: 'Login successful!'})
})

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy()
    res.clearCookie('session-id')
    res.redirect('/')
    return
  }
  let err = new Error('You are not logged in')
  err.status = 403
  next(err)
})

module.exports = router
