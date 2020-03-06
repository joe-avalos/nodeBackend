const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router()

const User = require('../models/user')

router.use(bodyParser.json())
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
});

router.post('/signup', (req, res, next) => {
  User.findOne({username: req.body.username})
    .then(user => {
      if (user !== null) {
        let err = new Error(`User ${req.body.username} already exists`)
        err.status = 403
        next(err)
      } else {
        return User.create({
          username: req.body.username,
          password: req.body.password
        })
      }
    })
    .then(user => {
      res.json({status: 'Registration successful!', user: user})
    }, e => next(e))
    .catch(e => next(e))
})

router.post('/login', (req, res, next) => {
  if (!req.session.user) {
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
    
    User.findOne({
      username: username
    })
      .then(user => {
        if (user === null) {
          let err = new Error('Wrong user/password')
          err.status = 403
          return next(err)
        }
        if (user.password !== password) {
          let err = new Error('Wrong user/password')
          err.status = 403
          return next(err)
        }
        req.session.user = 'authenticated'
        res.setHeader('Content-Type', 'text/plain')
        res.end("You're logged in")
      })
      .catch(e => next(e))
  } else {
    res.setHeader('Content-Type', 'text/plain')
    res.end("You're already logged in")
  }
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
