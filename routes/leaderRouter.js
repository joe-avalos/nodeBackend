const express = require('express')
const bodyParser = require('body-parser')

const leaderRouter = express.Router()

const Leaders = require('../models/leaders')
const authenticate = require('../authenticate')

leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
  .get((req, res, next) => {
    Leaders.find({}).then(leaders => res.json(leaders), e => next(e))
      .catch(e => next(e))
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
    Leaders.create(req.body)
      .then(leader => res.json(leader), e => next(e))
      .catch(e => next(e))
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /leaders')
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
    Leaders.remove({})
      .then(resp => res.json(resp), e => next(e))
      .catch(e => next(e))
  })
leaderRouter.route('/:leaderId')
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(leader => res.json(leader), e => next(e))
      .catch(e => next(e))
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /leaders/${req.params.leaderId}`)
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin,  (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
      }, {
        new: true
      }
    )
      .then(leader => res.json(leader), e => next(e))
      .catch(e => next(e))
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin,  (req, res) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
      .then(resp => res.json(resp), e => next(e))
      .catch(e => next(e))
  })

module.exports = leaderRouter
