const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose-currency')

const dishRouter = express.Router()

const Dishes = require('../models/dishes')

dishRouter.use(bodyParser.json())

dishRouter.route('/')
  .get((req, res, next) => {
    Dishes.find({}).then(dishes => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json(dishes)
    }, e => next(e))
      .catch(e => next(e))
  })
  .post((req, res, next) => {
    Dishes.create(req.body)
      .then(dish => {
        console.log('Dish created: ', dish)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish)
      }, e => next(e))
      .catch(e => next(e))
  })
  .put((req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /dishes')
  })
  .delete((req, res, next) => {
    Dishes.remove({})
      .then(resp => {
        console.log('Dish deleted')
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, e => next(e))
      .catch(e => next(e))
  })
dishRouter.route('/:dishId')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(dish => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish)
      }, e => next(e))
      .catch(e => next(e))
  })
  .post((req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /dishes/${req.params.dishId}`)
  })
  .put((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
      }, {
        new: true
      }
    )
      .then(dish => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(dish)
      }, e => next(e))
      .catch(e => next(e))
  })
  .delete((req, res) => {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then(resp => {
        console.log('Dish deleted')
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, e => next(e))
      .catch(e => next(e))
  })

module.exports = dishRouter
