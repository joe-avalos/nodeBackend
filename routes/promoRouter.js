const express = require('express')
const bodyParser = require('body-parser')

const promoRouter = express.Router()

const Promotions = require('../models/promotions')

promoRouter.use(bodyParser.json())

promoRouter.route('/')
  .get((req, res, next) => {
    Promotions.find({}).then(promos => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json(promos)
    }, e => next(e))
      .catch(e => next(e))
  })
  .post((req, res, next) => {
    Promotions.create(req.body)
      .then(promo => {
        console.log('Promotion created: ', promo)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promo)
      }, e => next(e))
      .catch(e => next(e))
  })
  .put((req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /promotions')
  })
  .delete((req, res, next) => {
    Promotions.remove({})
      .then(resp => {
        console.log('Promotions deleted')
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, e => next(e))
      .catch(e => next(e))
  })
promoRouter.route('/:promoId')
  .get((req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then(promo => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promo)
      }, e => next(e))
      .catch(e => next(e))
  })
  .post((req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /promotions/${req.params.promoId}`)
  })
  .put((req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
      }, {
        new: true
      }
    )
      .then(promo => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promo)
      }, e => next(e))
      .catch(e => next(e))
  })
  .delete((req, res) => {
    Promotions.findByIdAndRemove(req.params.promoId)
      .then(resp => {
        console.log('Promotion deleted')
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, e => next(e))
      .catch(e => next(e))
  })

module.exports = promoRouter
