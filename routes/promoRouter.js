const express = require('express')
const bodyParser = require('body-parser')

const promoRouter = express.Router()

const Promotions = require('../models/promotions')
const authenticate = require('../authenticate')

promoRouter.use(bodyParser.json())

promoRouter.route('/')
  .get((req, res, next) => {
    Promotions.find({}).then(promos => res.json(promos), e => next(e))
      .catch(e => next(e))
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Promotions.create(req.body)
      .then(promo => res.json(promo), e => next(e))
      .catch(e => next(e))
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /promotions')
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.remove({})
      .then(resp => res.json(resp), e => next(e))
      .catch(e => next(e))
  })
promoRouter.route('/:promoId')
  .get((req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then(promo => res.json(promo), e => next(e))
      .catch(e => next(e))
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /promotions/${req.params.promoId}`)
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
      }, {
        new: true
      }
    )
      .then(promo => res.json(promo), e => next(e))
      .catch(e => next(e))
  })
  .delete(authenticate.verifyUser, (req, res) => {
    Promotions.findByIdAndRemove(req.params.promoId)
      .then(resp => res.json(resp), e => next(e))
      .catch(e => next(e))
  })

module.exports = promoRouter
