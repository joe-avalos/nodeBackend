const express = require('express')
const bodyParser = require('body-parser')

const leaderRouter = express.Router()

const Leaders = require('../models/leaders')

leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
  .get((req, res, next) => {
    Leaders.find({}).then(leaders => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json(leaders)
    }, e => next(e))
      .catch(e => next(e))
  })
  .post((req, res, next) => {
    Leaders.create(req.body)
      .then(leader => {
        console.log('Promotion created: ', leader)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leader)
      }, e => next(e))
      .catch(e => next(e))
  })
  .put((req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /leaders')
  })
  .delete((req, res, next) => {
    Leaders.remove({})
      .then(resp => {
        console.log('Leaders deleted')
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, e => next(e))
      .catch(e => next(e))
  })
leaderRouter.route('/:leaderId')
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(leader => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leader)
      }, e => next(e))
      .catch(e => next(e))
  })
  .post((req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /leaders/${req.params.leaderId}`)
  })
  .put((req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
      }, {
        new: true
      }
    )
      .then(leader => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(leader)
      }, e => next(e))
      .catch(e => next(e))
  })
  .delete((req, res) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
      .then(resp => {
        console.log('Leader deleted')
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, e => next(e))
      .catch(e => next(e))
  })

module.exports = leaderRouter
