const express = require('express')
const bodyParser = require('body-parser')

const favoritesRouter = express.Router()

const Favorites = require('../models/favorites')
const Dishes = require('../models/dishes')
const authenticate = require('../authenticate')
const cors = require('./cors')

favoritesRouter.use(bodyParser.json())

favoritesRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id}).populate('dishes').then(favs => res.json(favs), e => next(e))
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
      .then(async favs => {
        let dishes = await Dishes.find().where('_id').in(req.body.dishes).exec()
        if (dishes.length !== req.body.dishes.length) {
          res.statusCode = 404
          let err = new Error(`One or more dishes not found, or duplicate entry!`)
          return next(err)
        }
        if (favs === null) {
          req.body.user = req.user._id
          req.body.dishes = dishes
          Favorites.create(req.body)
            .then(favs => res.json(favs), e => next(e))
        } else {
          let i = 0
          while (i < req.body.dishes.length) {
            if (favs.dishes.indexOf(req.body.dishes[i]._id) === -1) {
              let dish = await Dishes.findById(req.body.dishes[i]._id).exec()
              if (dish === null) {
                res.statusCode = 404
                let err = new Error(`Dish ${req.body.dishes[i]._id} not found!`)
                return next(err)
              }
              favs.dishes.push(dish)
            }
            i++
          }
          favs.save()
            .then(favs => {
              Favorites.findById(favs._id)
                .populate('dishes')
                .then(favs => res.json(favs))
            }, e => next(e))
        }
      }, e => next(e))
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /favorites')
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({user: req.user._id})
      .then(resp => res.json(resp), e => next(e))
  })
favoritesRouter.route('/:dishId')
  .get(cors.cors, (req, res) => {
    res.statusCode = 403
    res.end(`GET method not supported on /favorites/${req.params.dishId}`)
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
      .then(async favs => {
        let dish = await Dishes.findById(req.params.dishId).exec()
        if (favs === null) {
          req.body.user = req.user._id
          req.body.dishes = [dish]
          Favorites.create(req.body)
            .then(favs => res.json(favs), e => next(e))
        }
        if (dish === null) {
          res.statusCode = 404
          let err = new Error(`Dish ${req.params.dishId} not found!`)
          return next(err)
        }
        if (favs.dishes.indexOf(req.params.dishId) !== -1) {
          res.statusCode = 403
          let err = new Error(`Dish ${req.params.dishId} already in favorites!`)
          return next(err)
        }
        
        favs.dishes.push(dish)
        favs.save()
          .then(favs => {
            Favorites.findById(favs._id)
              .populate('dishes')
              .then(favs => res.json(favs))
          }, e => next(e))
      })
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403
    res.end(`PUT method not supported on /favorites/${req.params.dishId}`)
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
      .then(async favs => {
        let dish = await Dishes.findById(req.params.dishId).exec()
        if (favs === null) {
          res.statusCode = 404
          let err = new Error(`Favorites not found for user: ${req.user._id}!`)
          return next(err)
        }
        if (dish === null) {
          res.statusCode = 404
          let err = new Error(`Dish ${req.params.dishId} not found!`)
          return next(err)
        }
        if (favs.dishes.indexOf(req.params.dishId) === -1) {
          res.statusCode = 404
          let err = new Error(`Dish ${req.params.dishId} not in favorites!`)
          return next(err)
        }
      
        favs.dishes.remove(dish)
        favs.save()
          .then(favs => {
            Favorites.findById(favs._id)
              .populate('dishes')
              .then(favs => res.json(favs))
          }, e => next(e))
      })
  })

module.exports = favoritesRouter
