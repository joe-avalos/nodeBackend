const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const authenticate = require('../authenticate')

const router = express.Router()

const User = require('../models/user')

router.use(bodyParser.json())
/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
  User.find({})
    .then(users=>res.json(users), e => next(e))
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
        if (req.body.firstname) user.firstname = req.body.firstname
        if (req.body.lastname) user.lastname = req.body.lastname
        user.save((err,user)=>{
          if (err) {
            res.statusCode = 500
            res.json({err: err})
            return
          }
          passport.authenticate('local')(req, res, () => {
            res.json({success: true, status: 'Registration successful!'})
          })
        })
      }
    })
})

router.post('/login', passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({_id: req.user._id})
  res.json({success: true, token: token, status: 'Login successful!'})
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
